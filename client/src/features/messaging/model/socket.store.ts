import { create } from 'zustand';
import { SocketState, Message } from './types';
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notificationStore';

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    messages: [],

    connect: (url: string, token: string) => {
        const { socket } = get();
        // Prevent multiple connections
        if (socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) {
            return;
        }

        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WS Connected');
            // Authenticate immediately
            ws.send(JSON.stringify({ type: 'auth', token }));
            set({ isConnected: true });
        };

        ws.onmessage = (event) => {
            console.log('🔔 SOCKET.STORE: RAW message received:', event.data);
            try {
                const data = JSON.parse(event.data);
                console.log('🔔 SOCKET.STORE: Parsed message:', data);

                if (data.type === 'authenticated') {
                    console.log('WS Authenticated');
                } else if (data.type === 'unreadCount') {
                    console.log('🔔 SOCKET.STORE: Received unreadCount:', data.data);
                    // data.data is expected to be { general: number, support: number }
                    if (data.data && typeof data.data === 'object' && 'general' in data.data) {
                        useNotificationStore.getState().setUnreadCount(data.data);
                    } else {
                         // Fallback for number or unexpected format
                         const count = Number(data.data) || 0;
                         useNotificationStore.getState().setUnreadCount({ general: count, support: 0 });
                    }
                } else if (data.type === 'new_message') {
                    get().addMessage(data.message);
                    toast.info(`New message from ${data.message.senderRole}`);
                    
                    // Increment specific unread count based on message type
                    if (data.message.isSupport) {
                        useNotificationStore.getState().incrementUnreadCount('support');
                    } else {
                        useNotificationStore.getState().incrementUnreadCount('general');
                    }
                } else if (data.type === 'error') {
                    console.error('WS Error:', data.message);
                    toast.error(data.message);
                }
            } catch (err) {
                console.error('WS Parse Error', err);
            }
        };

        ws.onclose = () => {
            console.log('WS Disconnected');
            set({ isConnected: false, socket: null });
            // Reconnect logic could go here, but kept simple for now
        };

        ws.onerror = (err) => {
            console.error('WS Error', err);
        };

        set({ socket: ws });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
        }
        set({ socket: null, isConnected: false, messages: [] });
    },

    sendMessage: (receiverId: string, content: string, isSupport = false) => {
        const { socket } = get();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    type: 'message',
                    receiver_id: receiverId,
                    content,
                    isSupport,
                })
            );
            return true;
        } else {
            return false;
        }
    },

    addMessage: (message: Message) => {
        set((state) => ({ messages: [...state.messages, message] }));
    },
}));
