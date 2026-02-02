import { Request, Response, NextFunction } from 'express';
import { WorkVerificationService } from '../../application/services/WorkVerificationService';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class WorkVerificationController {
    private workVerificationService: WorkVerificationService;

    constructor({ workVerificationService }: { workVerificationService: WorkVerificationService }) {
        this.workVerificationService = workVerificationService;
    }

    logTime = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const timeLog = await this.workVerificationService.logTime(req.user!.id, req.body);
            res.status(201).json(timeLog);
        } catch (error: any) {
            next(error);
        }
    };

    approveTimeLog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const timeLog = await this.workVerificationService.approveTimeLog(req.params.id);
            res.json(timeLog);
        } catch (error: any) {
            next(error);
        }
    };

    rejectTimeLog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const timeLog = await this.workVerificationService.rejectTimeLog(req.params.id);
            res.json(timeLog);
        } catch (error: any) {
            next(error);
        }
    };

    getTimeLogsByProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const timeLogs = await this.workVerificationService.getTimeLogsByProject(req.params.projectId);
            res.json(timeLogs);
        } catch (error: any) {
            next(error);
        }
    };

    createMilestone = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const milestone = await this.workVerificationService.createMilestone(req.body);
            res.status(201).json(milestone);
        } catch (error: any) {
            next(error);
        }
    };

    requestMilestoneApproval = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const milestone = await this.workVerificationService.requestMilestoneApproval(req.params.id);
            res.json(milestone);
        } catch (error: any) {
            next(error);
        }
    };

    approveMilestone = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const milestone = await this.workVerificationService.approveMilestone(req.params.id);
            res.json(milestone);
        } catch (error: any) {
            next(error);
        }
    };

    getMilestonesByProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const milestones = await this.workVerificationService.getMilestonesByProject(req.params.projectId);
            res.json(milestones);
        } catch (error: any) {
            next(error);
        }
    };
}
