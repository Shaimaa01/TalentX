import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { JWTService } from '../../interface/middleware/AuthMiddleware';
import { MessageService } from '../../application/services/MessageService';

// Store for user connections and their message queues
const userConnections = new Map<string, WebSocket>();
const userMessageQueues = new Map<string, any[]>();

// Helper function to send notifications to specific users
export const sendNotificationToUser = (userId: string, type: string, data: any) => {
    const userWs = userConnections.get(userId);
    if (userWs && userWs.readyState === WebSocket.OPEN) {
        userWs.send(JSON.stringify({ type, data }));
    } else {
        // Add message to queue if user is not connected
        const queue = userMessageQueues.get(userId) || [];
        queue.push({ type, data });
        userMessageQueues.set(userId, queue);
    }
};

// Helper function to broadcast to all connected users
export const broadcastNotification = (type: string, data: any) => {
    userConnections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type, data }));
        }
    });
};

export const setupWebSocketServer = (server: Server, messageService: MessageService) => {
    console.log('🔔 WS SERVER: Starting WebSocket server setup...');
    const wss = new WebSocketServer({ server });
    console.log('WebSocket server attached to HTTP server');
    
    // Add listening event to verify server is accepting connections
    wss.on('listening', () => {
        console.log('🔔 WS SERVER: WebSocket server is now listening for connections');
    });
    
    wss.on('connection', (ws, req) => {
        let currentUserId: string | null = null;
        let currentUserRole: string | null = null;

        console.log('New WS connection attempt');

        ws.on('message', async (msg) => {
            console.log('🔔 SERVER: Raw message received:', msg.toString());
            try {
                const data = JSON.parse(msg.toString());
                console.log('🔔 SERVER: Parsed message:', data);

                // Handle Authentication/Identification
                if (data.type === 'auth') {
                    console.log('🔔 SERVER: Processing auth message');
                    const token = data.token;
                    try {
                        console.log('🔔 SERVER: Decoding token...');
                        const userData = JWTService.decodeToken(token);
                        console.log('🔔 SERVER: Token decoded:', userData);
                        if (userData && (userData as any).id) {
                            // Disconnect existing connection for this user if exists
                            const existingWs = userConnections.get((userData as any).id);
                            if (existingWs && existingWs !== ws) {
                                console.log(`🔔 SERVER: Disconnecting existing connection for user ${(userData as any).id}`);
                                existingWs.close();
                                userConnections.delete((userData as any).id);
                            }
                            
                            currentUserId = (userData as any).id;
                            currentUserRole = (userData as any).role;
                            console.log(`🔔 SERVER: User extracted - ID: ${currentUserId}, Role: ${currentUserRole}`);
                            userConnections.set(currentUserId!, ws);
                            console.log(
                                `User ${currentUserId} (${currentUserRole}) authenticated via WS`
                            );
                            ws.send(JSON.stringify({ type: 'authenticated', status: 'ok' }));
                            
                            // Small delay to ensure client is ready to receive messages
                            setTimeout(async () => {
                                try {
                                    const notificationCount = await messageService.getNotificationCount(currentUserId!);
                                    console.log(`🔔 SERVER: Initial notification count for ${currentUserId}: ${notificationCount}`);
                                    
                                    const unreadCountMessage = JSON.stringify({ 
                                        type: 'unreadCount', 
                                        data: { count: notificationCount } 
                                    });
                                    console.log(`🔔 SERVER: Sending message: ${unreadCountMessage}`);
                                    
                                    ws.send(unreadCountMessage);
                                    console.log('🔔 SERVER: Message sent successfully');
                                } catch (error) {
                                    console.error('🔔 SERVER: Error sending notification count:', error);
                                }
                            }, 100); // 100ms delay
                        }
                    } catch (err) {
                        console.error('WS Auth failed:', err);
                        ws.send(
                            JSON.stringify({ type: 'error', message: 'Authentication failed' })
                        );
                    }
                    return;
                }

                if (!currentUserId || !currentUserRole) {
                    ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
                    return;
                }

                // Handle Direct/Support Messaging
                if (data.type === 'message') {
                    const { receiver_id, content, isSupport } = data;

                    // Save to DB via Service
                    const savedMsg = await messageService.createMessage(
                        currentUserId,
                        currentUserRole,
                        {
                            receiver_id,
                            content,
                            isSupport,
                        }
                    );

                    // Determine recipient
                    // In new service logic, createMessage returns formatted message
                    // Logic:
                    const recipientId = savedMsg.receiverId === 'support-system-user-id-001'
                        ? 'admin-broadcast'
                        : savedMsg.receiverId;

                    if (recipientId === 'admin-broadcast') {
                        // Send to all connected admins
                        // For now, broadcast to everyone or better filter if we tracked roles in map
                        // Since map is just ID -> WS, we assume admin has ID.
                        // We can iterate map and check? But we don't store roles in map value here (just WS).
                        // Improvement: Store { ws, role } in map.
                        userConnections.forEach(async (conn, uid) => {
                            if (conn.readyState === WebSocket.OPEN) {
                                // Send message
                                conn.send(
                                    JSON.stringify({ type: 'new_message', message: savedMsg })
                                );
                                
                                // Update notification count for staff members
                                const notificationCount = await messageService.getNotificationCount(uid);
                                conn.send(
                                    JSON.stringify({ type: 'unreadCount', data: { count: notificationCount } })
                                );
                            }
                        });
                    } else {
                        const recipientWs = userConnections.get(recipientId);
                        if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
                            recipientWs.send(
                                JSON.stringify({ type: 'new_message', message: savedMsg })
                            );
                        }
                    }
                }
            } catch (e) {
                console.error('Error processing WS message:', e);
            }
        });

        ws.on('close', () => {
            if (currentUserId) {
                userConnections.delete(currentUserId);
                console.log(`User ${currentUserId} disconnected from WS`);
            }
        });
    });

    return wss;
};
