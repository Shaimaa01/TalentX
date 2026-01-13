import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireRole } from '../middleware/AuthMiddleware';

export const createUserRoutes = (controller: UserController) => {
    const router = Router();

    // Protect all user routes
    router.use(authenticateToken);

    router.get('/', requireRole(['admin', 'core_team']), controller.getAllUsers);
    router.get('/:id', controller.getUserById);
    router.post('/', requireRole(['admin', 'core_team']), controller.createUser);
    router.patch('/:id', requireRole(['admin', 'core_team']), controller.updateUser);
    router.delete('/:id', requireRole(['admin']), controller.deleteUser);

    return router;
};
