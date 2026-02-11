import { Request, Response, NextFunction } from 'express';
import { AuditLogService } from '../../application/services/AuditLogService';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class AuditLogController {
    private auditLogService: AuditLogService;

    constructor({ auditLogService }: { auditLogService: AuditLogService }) {
        this.auditLogService = auditLogService;
    }

    listLogs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { entityType, startDate, endDate } = req.query as any;
            const logs = await this.auditLogService.listLogs({ entityType, startDate, endDate });
            res.json(logs);
        } catch (error: any) {
            next(error);
        }
    }
}
