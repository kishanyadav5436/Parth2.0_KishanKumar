import React, { createContext, useContext, useState, useEffect } from 'react';

import { API_BASE_URL } from '../config';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'promo' | 'system' | 'provider';
  read: boolean;
  createdAt: string;
  link?: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isLoading: boolean;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  const [isLoading, setIsLoading] = useState(true);

  // Initial notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Welcome to ServiceHub! 🎉',
      message: 'Get 20% off your first home service with code WELCOME20.',
      type: 'promo',
      read: false,
      createdAt: '10 mins ago',
      link: '/services'
    },
    {
      id: 'n2',
      title: 'Verified Experts Ready',
      message: 'Over 10,000+ background-checked pros are live in your area.',
      type: 'system',
      read: false,
      createdAt: '1 hour ago',
      link: '/services'
    },
    {
      id: 'n3',
      title: 'Service Guarantee 🛡️',
      message: 'All appointments include our 100% satisfaction protection policy.',
      type: 'system',
      read: true,
      createdAt: '1 day ago',
      link: '/support?tab=safety'
    }
  ]);

  useEffect(() => {
    // Persist theme
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Check auth on mount
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Auth check failed', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: Date.now().toString(),
      read: false,
      createdAt: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user, setUser, theme, toggleTheme, isLoading,
      notifications, unreadNotificationsCount, markNotificationAsRead,
      clearAllNotifications, addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
