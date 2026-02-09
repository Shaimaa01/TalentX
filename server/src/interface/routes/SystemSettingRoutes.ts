import { Router } from 'express';
import { SystemSettingController } from '../controllers/SystemSettingController';
import { authenticateToken, requireRole } from '../middleware/AuthMiddleware';

export const createSystemSettingRoutes = (controller: SystemSettingController) => {
    const router = Router();

    // Public GET to check if maintenance is on (frontend needs this)
    router.get('/maintenance', controller.getMaintenanceMode);

    // Protected routes to change settings
    router.post(
        '/maintenance',
        authenticateToken,
        requireRole(['admin']),
        controller.setMaintenanceMode
    );
    router.post(
        '/commission',
        authenticateToken,
        requireRole(['admin']),
        controller.setPlatformCommission
    );
    router.post(
        '/vetting',
        authenticateToken,
        requireRole(['admin']),
        controller.setAutomaticVetting
    );
    router.get('/all', authenticateToken, requireRole(['admin']), controller.getAllSettings);

    return router;
};
