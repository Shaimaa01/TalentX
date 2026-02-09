import { Request, Response } from 'express';
import { WorkVerificationService } from '../../application/services/WorkVerificationService';

export class WorkVerificationController {
    private workVerificationService: WorkVerificationService;

    constructor({ workVerificationService }: { workVerificationService: WorkVerificationService }) {
        this.workVerificationService = workVerificationService;
    }

    logTime = async (req: Request, res: Response) => {
        try {
            const timeLog = await this.workVerificationService.logTime(req.user!.id, req.body);
            res.status(201).json(timeLog);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    approveTimeLog = async (req: Request, res: Response) => {
        try {
            const timeLog = await this.workVerificationService.approveTimeLog(req.params.id);
            res.json(timeLog);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    rejectTimeLog = async (req: Request, res: Response) => {
        try {
            const timeLog = await this.workVerificationService.rejectTimeLog(req.params.id);
            res.json(timeLog);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getTimeLogsByProject = async (req: Request, res: Response) => {
        try {
            const timeLogs = await this.workVerificationService.getTimeLogsByProject(
                req.params.projectId
            );
            res.json(timeLogs);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    createMilestone = async (req: Request, res: Response) => {
        try {
            const milestone = await this.workVerificationService.createMilestone(req.body);
            res.status(201).json(milestone);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    requestMilestoneApproval = async (req: Request, res: Response) => {
        try {
            const milestone = await this.workVerificationService.requestMilestoneApproval(
                req.params.id
            );
            res.json(milestone);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    approveMilestone = async (req: Request, res: Response) => {
        try {
            const milestone = await this.workVerificationService.approveMilestone(req.params.id);
            res.json(milestone);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getMilestonesByProject = async (req: Request, res: Response) => {
        try {
            const milestones = await this.workVerificationService.getMilestonesByProject(
                req.params.projectId
            );
            res.json(milestones);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
}
