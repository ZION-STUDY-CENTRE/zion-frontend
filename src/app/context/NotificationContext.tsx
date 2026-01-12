import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../services/api';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';

interface Notification {
  _id: string;
  type: 'message' | 'assignment' | 'quiz' | 'material' | 'submission' | 'grade' | 'comment' | 'system';
  title: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
  sender?: { name: string; email: string; role: string };
  metadata?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsReadLocal: (notificationId: string) => Promise<void>;
  markAllAsReadLocal: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();
  const { user } = useAuth();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Mark notification as read
  const markAsReadLocal = useCallback(async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      await fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [fetchUnreadCount]);

  // Mark all as read
  const markAllAsReadLocal = useCallback(async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  // Add new notification to the list
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Listen for real-time notifications via Socket.io
  useEffect(() => {
    if (!socket) {
      console.log('[NotificationContext] ⏳ Waiting for socket to connect...');
      return;
    }

    console.log('[NotificationContext] ✅ Socket available, setting up listeners...');
    console.log(`   - Socket ID: ${socket.id}`);
    console.log(`   - Socket Connected: ${socket.connected}`);

    // Setup notification listeners
    const handleNotificationNew = (notification: Notification) => {
      console.log('[Notification] 📬 Received notification:new:', notification);
      addNotification(notification);
    };

    const handleMessageSent = (data: any) => {
      console.log('[Notification] 💬 Received notification:message-sent:', data);
      addNotification({
        _id: Math.random().toString(),
        type: 'message',
        title: `Message from ${data.senderName}`,
        message: data.message || 'New message received',
        isRead: false,
        createdAt: new Date().toISOString(),
        metadata: data
      });
    };

    const handleAssignmentShared = (data: any) => {
      console.log('[Notification] 📚 Received notification:assignment-shared:', data);
      addNotification({
        _id: Math.random().toString(),
        type: 'assignment',
        title: `Assignment: ${data.assignmentTitle}`,
        message: 'A new assignment has been shared with you',
        isRead: false,
        createdAt: new Date().toISOString(),
        metadata: data
      });
    };

    const handleSubmissionReceived = (data: any) => {
      console.log('[Notification] 📤 Received notification:submission-received:', data);
      addNotification({
        _id: Math.random().toString(),
        type: 'submission',
        title: `New Submission from ${data.studentName}`,
        message: `Assignment "${data.assignmentTitle}" has been submitted`,
        isRead: false,
        createdAt: new Date().toISOString(),
        metadata: data
      });
    };

    // Register listeners
    socket.on('notification:new', handleNotificationNew);
    socket.on('notification:message-sent', handleMessageSent);
    socket.on('notification:assignment-shared', handleAssignmentShared);
    socket.on('notification:submission-received', handleSubmissionReceived);

    // Cleanup function
    return () => {
      console.log('[NotificationContext] 🧹 Cleaning up socket listeners');
      socket.off('notification:new', handleNotificationNew);
      socket.off('notification:message-sent', handleMessageSent);
      socket.off('notification:assignment-shared', handleAssignmentShared);
      socket.off('notification:submission-received', handleSubmissionReceived);
    };
  }, [socket, addNotification]);

  // Fetch initial notifications on mount (only if authenticated)
  useEffect(() => {
    if (!user) return; // Don't fetch if not authenticated

    fetchNotifications();
    fetchUnreadCount();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, fetchNotifications, fetchUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        fetchUnreadCount,
        markAsReadLocal,
        markAllAsReadLocal,
        addNotification,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
