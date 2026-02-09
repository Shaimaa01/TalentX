import { PrismaClient } from '@prisma/client';
import { INotificationRepository, NotificationData } from '../../domain/repositories/INotificationRepository';

export class PrismaNotificationRepository implements INotificationRepository {
    private prisma: PrismaClient;

    constructor({ prisma }: { prisma: PrismaClient }) {
        this.prisma = prisma;
    }
    async create(data: NotificationData): Promise<void> {
        await this.prisma.notification.create({
            data: {
                type: data.type,
                content: data.content,
                userId: data.userId || 'system', // Ensure userId is present or nullable in schema? Schema likely allow null or requires it.
                // Assuming schema matches.
                data: data.data || null,
                isRead: false,
            },
        });
    }

    async findByUserId(userId: string): Promise<any[]> {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async markAsRead(id: string): Promise<void> {
        await this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
}
