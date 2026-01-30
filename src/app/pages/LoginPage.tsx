import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import leftImage from "../../assets/building.jpg";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Lock, Mail, Loader2 } from 'lucide-react';
import { loginUser, changeInitialPassword, resendVerificationEmail } from '../services/api';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  const { login, updateUser, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      redirectBasedOnRole(user.role);
    }
  }, [user, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginUser({ email, password });
      
      // Backend now returns { user: ... } but no token in body (it's in cookie)
      const { user: userData } = data;
      login(userData);

      // Check if first login
      if (userData.isFirstLogin) {
        setShowChangePassword(true);
      } else {
        redirectBasedOnRole(userData.role);
      }
    } catch (err: any) {
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(err.email || email);
        setError('Please verify your email address before logging in.');
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setIsLoading(true);
    try {
        await resendVerificationEmail(unverifiedEmail);
        alert('Verification email sent! Please check your inbox.');
        setError(''); 
        setUnverifiedEmail(null);
    } catch (err: any) {
        alert(err.message || 'Failed to send email');
    } finally {
        setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await changeInitialPassword(newPassword);

      // Update local user state
      if (user) {
        const updatedUser = { ...user, isFirstLogin: false };
        updateUser(updatedUser);
        redirectBasedOnRole(user.role);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'instructor':
        navigate('/instructor/dashboard');
        break;
      case 'student':
        navigate('/student/dashboard');
        break;
      case 'media-manager':
        navigate('/media/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  if (showChangePassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Change Password</CardTitle>
            <CardDescription className="text-center">
              This is your first login. Please secure your account by setting a new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading screen if auth is still loading and user exists (redirecting)
  if (loading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Image Background */}
      <div 
        className="hidden md:flex md:w-3/5 lg:w-2/3 bg-cover bg-center relative items-center justify-center"
        style={{
          backgroundImage: `url(${leftImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white space-y-6 px-8">
          <div className="flex items-center justify-center gap-4">
            <img src="https://zion-frontend-ashen.vercel.app/logo.png" alt="Zion Logo" className="h-16 w-16 object-contain" />
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Zion Study Center
            </h1>
          </div>
          <div className="h-1 w-20 bg-white mx-auto"></div>
          <p className="text-lg md:text-xl text-gray-100 font-light tracking-wide">
            Excellence in Educational Development
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-sm">
          <div className="space-y-8">
            {/* Header - Centered */}
            <div className="text-center space-y-4">
              <img src="https://zion-frontend-ashen.vercel.app/logo.png" alt="Zion Logo" className="h-12 w-12 object-contain mx-auto" />
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome</h2>
              <p className="text-gray-600 font-light text-base">Kindly log into your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="flex flex-col gap-2">
                       <span>{error}</span>
                       {unverifiedEmail && (
                           <Button 
                               type="button" 
                               variant="outline" 
                               size="sm" 
                               onClick={handleResendVerification}
                               className="w-full mt-2 bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                           >
                               {isLoading ? 'Sending...' : 'Resend Verification Email'}
                           </Button>
                       )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-700 font-medium text-sm block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    className="h-11 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-gray-700 font-medium text-sm block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-9 bg-blue-900 hover:bg-blue-950 text-white font-medium rounded-md transition-colors duration-150 mt-6 text-sm" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                SIGN IN
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
              <p className="font-light">© 2026 All rights reserved: Zion Study Center</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
