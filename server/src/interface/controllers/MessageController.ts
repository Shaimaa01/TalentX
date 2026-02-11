import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../../application/services/MessageService';
import { CreateMessageSchema } from '../../application/dtos/MessageDTO';
import { AuthRequest } from '../middleware/AuthMiddleware';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class MessageController {
    private messageService: MessageService;

    constructor({ messageService }: { messageService: MessageService }) {
        this.messageService = messageService;
    }

    listMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const messages = await this.messageService.listMessages(
                req.user!.id,
                req.user!.role,
                req.query as any
            );
            res.json(messages);
        } catch (error: any) {
            next(error);
        }
    };

    createMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const validation = CreateMessageSchema.safeParse(req.body);
            if (!validation.success) {
                return next(new ErrorApp("Validation Error", 400, JSON.stringify(validation.error.issues)));
            }
            const message = await this.messageService.createMessage(
                req.user!.id,
                req.user!.role,
                validation.data
            );
            res.status(201).json(message);
        } catch (error: any) {
            next(error);
        }
    };

    getUnreadCount = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const counts = await this.messageService.getUnreadCount(req.user!.id, req.user!.role);
            res.json(counts);
        } catch (error: any) {
            next(error);
        }
    };

    markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const result = await this.messageService.markAsRead(
                req.user!.id,
                req.user!.role,
                req.body
            );
            res.json(result);
        } catch (error: any) {
            next(error);
        }
    };
}
