export interface Message {
    id: string;
    senderId: string;
    senderRole: string;
    receiverId: string;
    content: string;
    createdAt: string;
    isSupport?: boolean;
}

export interface SocketState {
    socket: WebSocket | null;
    isConnected: boolean;
    messages: Message[];
    connect: (url: string, token: string) => void;
    disconnect: () => void;
    sendMessage: (receiverId: string, content: string, isSupport?: boolean) => boolean;
    addMessage: (message: Message) => void;
}
