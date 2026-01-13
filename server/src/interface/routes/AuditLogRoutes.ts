import { Router } from 'express';
import { AuditLogController } from '../controllers/AuditLogController';
import { authenticateToken, requireRole } from '../middleware/AuthMiddleware';

export const createAuditLogRoutes = (controller: AuditLogController) => {
    const router = Router();

    // In a real app, you'd add verifyAdmin middleware here
    router.use(authenticateToken);
    router.get('/', requireRole(['admin', 'core_team']), (req, res) => controller.listLogs(req, res));

    return router;
};
