import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../../application/services/NotificationService';
import { AuthRequest } from '../middleware/AuthMiddleware';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class NotificationController {
    private notificationService: NotificationService;

    constructor({ notificationService }: { notificationService: NotificationService }) {
        this.notificationService = notificationService;
    }

    listNotifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.query.userId as string;
            const notifications = await this.notificationService.listNotifications(userId);
            res.json(notifications);
        } catch (error: any) {
            next(error);
        }
    };

    markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await this.notificationService.markAsRead(req.params.id);
            res.json({ success: true });
        } catch (error: any) {
            next(error);
        }
    };
}
