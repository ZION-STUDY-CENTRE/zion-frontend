import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getMe, logoutUser } from '../services/api';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student' | 'media-manager';
  isFirstLogin: boolean;
  program?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    // START: Migration Cleanup (Remove this block after a few weeks)
    if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    // END: Migration Cleanup

    const checkUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        // Not logged in or session expired
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
  };

 const logout = async () => {
  try {
    await logoutUser();
  } catch (e) {
    console.error("Logout failed", e);
  } finally {
    setUser(null);
    window.location.replace("/login");
  }
};


  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
