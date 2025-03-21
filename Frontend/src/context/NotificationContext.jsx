import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useSocket } from './SocketContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useSocket();

  useEffect(() => {
    fetchNotifications();
    if (socket) {
      setupSocketListeners();
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/notification');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const setupSocketListeners = () => {
    socket.on('newApplication', (data) => {
      addNotification({
        type: 'APPLICATION_RECEIVED',
        title: 'New Application',
        message: `${data.applicantName} has applied for ${data.jobTitle}`,
        createdAt: new Date(),
        read: false
      });
    });

    socket.on('applicationUpdate', (data) => {
      addNotification({
        type: 'APPLICATION_STATUS',
        title: 'Application Update',
        message: `Your application for ${data.jobTitle} has been ${data.status}`,
        createdAt: new Date(),
        read: false
      });
    });

    socket.on('interviewScheduled', (data) => {
      addNotification({
        type: 'INTERVIEW_SCHEDULED',
        title: 'Interview Scheduled',
        message: `Your interview for ${data.jobTitle} has been scheduled`,
        createdAt: new Date(),
        read: false
      });
    });
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/notification/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/notification/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`/notification/${notificationId}`);
      if (response.data.message === 'Notification deleted successfully') {
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        const unreadNotification = notifications.find(n => n._id === notificationId && !n.read);
        if (unreadNotification) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error; // Re-throw the error so we can handle it in the component
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 