import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsReadLocal, markAllAsReadLocal, deleteNotificationLocal, clearNotifications } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const recentNotifications = notifications.slice(0, 3);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'assignment':
      case 'quiz':
      case 'material':
        return '📚';
      case 'submission':
        return '📤';
      case 'grade':
        return '⭐';
      case 'comment':
        return '💭';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-50 border-blue-200';
      case 'assignment':
      case 'quiz':
        return 'bg-purple-50 border-purple-200';
      case 'submission':
        return 'bg-green-50 border-green-200';
      case 'grade':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1 -translate-y-1 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={async () => {
                    await markAllAsReadLocal();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={async () => {
                    if (window.confirm('Clear all notifications?')) {
                      await clearNotifications();
                    }
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 hover:bg-gray-50 transition-colors border-l-4 ${
                      notification.isRead ? 'border-gray-200' : 'border-blue-500'
                    } ${getNotificationColor(notification.type)}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                          {!notification.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                        </div>
                        {notification.message && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          await deleteNotificationLocal(notification._id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={async () => {
                          await markAsReadLocal(notification._id);
                        }}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark as read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 3 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <a href="#notifications" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all notifications →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { NotificationBell };
