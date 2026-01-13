import { Request, Response, NextFunction } from 'express';
import { SystemSettingService } from '../../application/services/SystemSettingService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const maintenanceMiddleware = (systemSettingService: SystemSettingService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Skip maintenance check for pure health checks or status
        if (req.path === '/health' || req.path === '/api/settings/maintenance') {
            return next();
        }

        const isMaintenance = await systemSettingService.getMaintenanceMode();

        if (isMaintenance) {
            // Allow admin paths and auth
            const isAdminPath = req.path.startsWith('/api/admin') || req.path.startsWith('/admin');
            const isAuthPath = req.path.startsWith('/api/auth') || req.path.includes('login');

            // Allow if user is admin (check token directly since global auth might not have run)
            let isAdminUser = false;
            const token = req.cookies?.access_token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

            if (token) {
                try {
                    const decoded = jwt.verify(token, JWT_SECRET) as any;
                    isAdminUser = decoded.role === 'admin';
                } catch (e) {
                    // Invalid token, ignore
                }
            }

            if (!isAdminPath && !isAuthPath && !isAdminUser) {
                return res.status(503).json({
                    error: 'Maintenance Mode',
                    message: 'Platform is currently undergoing scheduled maintenance. Please try again later.'
                });
            }
        }

        next();
    };
};
