import { Router } from 'express';
import { WorkVerificationController } from '../controllers/WorkVerificationController';
import { authenticateToken } from '../middleware/AuthMiddleware';

export const setupWorkVerificationRoutes = (controller: WorkVerificationController) => {
    const router = Router();

    router.use(authenticateToken);

    // Time Logs
    router.post('/time-logs', controller.logTime);
    router.get('/time-logs/project/:projectId', controller.getTimeLogsByProject);
    router.patch('/time-logs/:id/approve', controller.approveTimeLog);
    router.patch('/time-logs/:id/reject', controller.rejectTimeLog);

    // Milestones
    router.post('/milestones', controller.createMilestone);
    router.get('/milestones/project/:projectId', controller.getMilestonesByProject);
    router.patch('/milestones/:id/request-approval', controller.requestMilestoneApproval);
    router.patch('/milestones/:id/approve', controller.approveMilestone);

    return router;
};
