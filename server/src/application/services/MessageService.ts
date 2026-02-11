import { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateMessageDTO } from '../dtos/MessageDTO';
import { sendNotificationToUser } from '../../infrastructure/websocket/WebSocketServer';

export class MessageService {
    private static SUPPORT_ID = 'support-system-user-id-001';

    private messageRepo: IMessageRepository;
    private notificationRepo: INotificationRepository;
    private userRepo: IUserRepository;

    constructor({
        messageRepo,
        notificationRepo,
        userRepo,
    }: {
        messageRepo: IMessageRepository;
        notificationRepo: INotificationRepository;
        userRepo: IUserRepository;
    }) {
        this.messageRepo = messageRepo;
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
    }

    private formatMessage(m: any) {
        return {
            ...m,
            sender_name:
                m.senderId === MessageService.SUPPORT_ID
                    ? 'Admin Support'
                    : m.sender?.full_name || 'System',
            sender_avatar:
                m.senderId === MessageService.SUPPORT_ID
                    ? 'https://ui-avatars.com/api/?name=Admin+Support&background=00c853&color=fff'
                    : m.sender?.avatar_url,
        };
    }

    private formatThreads(threads: any[]) {
        return threads.map((t) => ({
            userId: t.senderId,
            userName: t.sender?.full_name || 'Unknown User',
            userAvatar: t.sender?.avatar_url || null,
            lastMessage: t.content,
            time: t.timestamp,
        }));
    }

    private isSupportStaff(role: string) {
        return ['admin', 'core_team'].includes(role);
    }

    async listMessages(userId: string, role: string, query: any) {
        const isSupport = query.isSupport === 'true';
        const targetQueryId = query.userId || query.threadUserId || query.receiverID;

        if (isSupport && this.isSupportStaff(role) && query.type === 'threads') {
            const threads = await this.messageRepo.findSupportThreads(MessageService.SUPPORT_ID);
            return this.formatThreads(threads);
        }

        if (isSupport) {
            const targetId = this.isSupportStaff(role) && targetQueryId ? targetQueryId : userId;
            const messages = await this.messageRepo.findSupportMessages(
                targetId,
                MessageService.SUPPORT_ID
            );
            return messages.map((m) => this.formatMessage(m));
        }

        // Direct Messages
        if (!targetQueryId) {
            // Return empty or list of recent chats? For now, empty to avoid 500
            return [];
        }
        const messages = await this.messageRepo.findDirectMessages(userId, targetQueryId);
        return messages.map((m) => this.formatMessage(m));
    }

    async createMessage(senderId: string, role: string, dto: CreateMessageDTO) {
        const isSupport = dto.isSupport === true || dto.isSupport === 'true';

        if (isSupport) {
            await this.userRepo.ensureSupportUser(MessageService.SUPPORT_ID);
        }

        // Validate receiver_id for non-support messages
        if (!isSupport && !dto.receiver_id) {
            throw new Error('receiver_id is required for direct messages');
        }

        const actualSenderId =
            isSupport && this.isSupportStaff(role) ? MessageService.SUPPORT_ID : senderId;
        const actualReceiverId =
            isSupport && !this.isSupportStaff(role) ? MessageService.SUPPORT_ID : dto.receiver_id!;

        const message = await this.messageRepo.create({
            senderId: actualSenderId,
            receiverId: actualReceiverId,
            content: dto.content,
        });

        // Send real-time notification to recipient
        if (!isSupport) {
            const unreadCount = await this.getUnreadCount(actualReceiverId, 'client'); // Get updated count
            sendNotificationToUser(actualReceiverId, 'unreadCount', { count: unreadCount });
            sendNotificationToUser(actualReceiverId, 'newMessage', this.formatMessage(message));
        }

        // Notifications for support tickets (database only - WebSocket handled by server)
        if (isSupport && !this.isSupportStaff(role)) {
            // Create ONE shared notification that all admins can see
            // Use a special admin user ID or create a system notification
            await this.notificationRepo.create({
                userId: 'admin-broadcast', // Special ID for shared admin notifications
                type: 'support_ticket',
                content: `New support ticket: "${dto.content.substring(0, 30)}..."`,
                data: JSON.stringify({ senderId, messageId: message.id }),
            });
            console.log('🔔 SHARED NOTIFICATION: Created 1 shared admin notification');
        }

        return this.formatMessage(message);
    }

    async getUnreadCount(userId: string, role: string) {
        return this.messageRepo.countUnreadLegacy(
            userId,
            MessageService.SUPPORT_ID,
            this.isSupportStaff(role)
        );
    }

    async getNotificationCount(userId: string) {
        try {
            console.log(`🔔 MESSAGE SERVICE: Getting notification count for user: ${userId}`);
            
            // Count unread database notifications for this specific user
            const personalNotifications = await this.notificationRepo.findByUserId(userId);
            const personalCount = personalNotifications.filter(n => !n.isRead).length;
            console.log(`🔔 MESSAGE SERVICE: Personal notifications: ${personalNotifications.length}, unread: ${personalCount}`);
            
            // For admins, also count shared admin-broadcast notifications
            const sharedNotifications = await this.notificationRepo.findByUserId('admin-broadcast');
            const sharedCount = sharedNotifications.filter(n => !n.isRead).length;
            console.log(`🔔 MESSAGE SERVICE: Shared notifications: ${sharedNotifications.length}, unread: ${sharedCount}`);
            
            const totalCount = personalCount + sharedCount;
            console.log(`🔔 MESSAGE SERVICE: Total count for ${userId}: ${totalCount}`);
            
            return totalCount;
        } catch (error) {
            console.error('🔔 MESSAGE SERVICE: Error getting notification count:', error);
            return 0;
        }
    }

    async markAsRead(userId: string, role: string, dto: any) {
        const { isSupport, threadUserId } = dto;
        let where: any = { read: false };

        if (isSupport) {
            if (this.isSupportStaff(role)) {
                where = {
                    ...where,
                    senderId: threadUserId,
                    receiverId: MessageService.SUPPORT_ID,
                };
            } else {
                where = {
                    ...where,
                    senderId: MessageService.SUPPORT_ID,
                    receiverId: userId,
                };
            }
        } else {
            where = {
                ...where,
                receiverId: userId,
                NOT: [
                    { senderId: MessageService.SUPPORT_ID },
                    { receiverId: MessageService.SUPPORT_ID },
                ],
            };
        }

        await this.messageRepo.updateReadStatus(where);
        return { success: true };
    }
}
