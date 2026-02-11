import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationState {
  unreadCount: { general: number; support: number; total: number };
  lastMessage: any;
  isConnected: boolean;
  setUnreadCount: (count: { general: number; support: number }) => void;
  setLastMessage: (message: any) => void;
  setIsConnected: (connected: boolean) => void;
  incrementUnreadCount: (type: 'general' | 'support') => void;
  decrementUnreadCount: (type: 'general' | 'support') => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      unreadCount: { general: 0, support: 0, total: 0 },
      lastMessage: null,
      isConnected: false,
      setUnreadCount: (count) => {
        console.log('🔔 STORE: Setting unread count to:', count);
        const total = (count.general || 0) + (count.support || 0);
        set({ unreadCount: { ...count, total } });
      },
      setLastMessage: (message) => set({ lastMessage: message }),
      setIsConnected: (connected) => set({ isConnected: connected }),
      incrementUnreadCount: (type) => set((state) => {
        const newGeneral = type === 'general' ? state.unreadCount.general + 1 : state.unreadCount.general;
        const newSupport = type === 'support' ? state.unreadCount.support + 1 : state.unreadCount.support;
        return { 
            unreadCount: {
                general: newGeneral,
                support: newSupport,
                total: newGeneral + newSupport
            }
        };
      }),
      decrementUnreadCount: (type) => set((state) => {
        const newGeneral = type === 'general' ? Math.max(0, state.unreadCount.general - 1) : state.unreadCount.general;
        const newSupport = type === 'support' ? Math.max(0, state.unreadCount.support - 1) : state.unreadCount.support;
        return { 
            unreadCount: {
                general: newGeneral,
                support: newSupport,
                total: newGeneral + newSupport
            }
        };
      }),
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        unreadCount: state.unreadCount,
      }),
    }
  )
);
