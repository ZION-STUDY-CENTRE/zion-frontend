import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  activeUsers: any[];
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, text: string, fileUrl?: string, fileName?: string) => void;
  sendTyping: (conversationId: string) => void;
  sendTypingStop: (conversationId: string) => void;
  sendNotification: (recipientId: string, type: string, title: string, message: string, data?: any) => void;
  broadcastNotification: (type: string, title: string, message: string, data?: any) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) return;

    const socketURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    const newSocket = io(socketURL, {
      auth: {
        token
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('🔌 Socket connected:', newSocket.id);
      console.log('   - Connecting to:', socketURL);
      console.log('   - Token present:', !!token);
      setIsConnected(true);
      newSocket.emit('users:active');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    newSocket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    newSocket.on('users:active', (users) => {
      setActiveUsers(users);
    });

    newSocket.on('user:online', (userData) => {
      console.log('✅ User online:', userData);
      setActiveUsers(prev => {
        const filtered = prev.filter(u => u.userId.toString() !== userData.userId.toString());
        return [...filtered, userData];
      });
    });

    newSocket.on('user:offline', (userData) => {
      console.log('❌ User offline:', userData);
      setActiveUsers(prev => prev.filter(u => u.userId.toString() !== userData.userId.toString()));
    });

    setSocket(newSocket);
    socketRef.current = newSocket;
    console.log('✅ Socket state updated in SocketProvider');

    return () => {
      console.log('🔌 Disconnecting socket...');
      newSocket.disconnect();
    };
  }, []);

  const joinConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('conversation:join', conversationId);
    }
  };

  const leaveConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('conversation:leave', conversationId);
    }
  };

  const sendMessage = (conversationId: string, text: string, fileUrl?: string, fileName?: string) => {
    if (socket) {
      socket.emit('message:send', {
        conversationId,
        text,
        fileUrl,
        fileName
      });
    }
  };

  const sendTyping = (conversationId: string) => {
    if (socket) {
      socket.emit('user:typing', conversationId);
    }
  };

  const sendTypingStop = (conversationId: string) => {
    if (socket) {
      socket.emit('user:typing-stop', conversationId);
    }
  };

  const sendNotification = (recipientId: string, type: string, title: string, message: string, data?: any) => {
    if (socket) {
      socket.emit('notification:send', {
        recipientId,
        type,
        title,
        message,
        data
      });
    }
  };

  const broadcastNotification = (type: string, title: string, message: string, data?: any) => {
    if (socket) {
      socket.emit('notification:broadcast', {
        type,
        title,
        message,
        data
      });
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    activeUsers,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
    sendTypingStop,
    sendNotification,
    broadcastNotification
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
