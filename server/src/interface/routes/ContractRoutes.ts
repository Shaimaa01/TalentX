
import { Router } from 'express';
import { ContractController } from '../controllers/ContractController';
import { authenticateToken } from '../middleware/AuthMiddleware';

export const createContractRoutes = (controller: ContractController) => {
    const router = Router();

    router.use(authenticateToken);

    router.post('/', controller.createContract);
    router.get('/project/:projectId', controller.getContractsByProject);
    router.post('/:id/sign', controller.signContract);

    return router;
};
