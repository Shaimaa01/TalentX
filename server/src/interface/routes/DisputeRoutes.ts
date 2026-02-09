import { Router } from 'express';
import { DisputeController } from '../controllers/DisputeController';
import { authenticateToken, requireRole } from '../middleware/AuthMiddleware';

export const createDisputeRoutes = (controller: DisputeController) => {
    const router = Router();

    router.use(authenticateToken);

    router.post('/', controller.createDispute);
    router.get('/project/:projectId', controller.getDisputesByProject);

    // Admin only routes
    router.get('/admin/all', requireRole(['admin']), controller.getAllDisputes);
    router.post('/:id/resolve', requireRole(['admin']), controller.resolveDispute);

    return router;
};
