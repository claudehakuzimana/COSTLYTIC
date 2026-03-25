import { create } from 'zustand';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    }));
    
    return id;
  },
  
  markAsRead: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        return {
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        };
      }
      return state;
    });
  },
  
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
  
  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id);
      return {
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: notification && !notification.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount,
      };
    });
  },
  
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));

export default useNotificationStore;
