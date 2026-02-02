import { Request, Response, NextFunction } from 'express';
import { DisputeService } from '../../application/services/DisputeService';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class DisputeController {
    private disputeService: DisputeService;

    constructor({ disputeService }: { disputeService: DisputeService }) {
        this.disputeService = disputeService;
    }

    createDispute = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dispute = await this.disputeService.createDispute(req.user!.id, req.body);
            res.status(201).json(dispute);
        } catch (error: any) {
            next(error);
        }
    };

    getAllDisputes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const disputes = await this.disputeService.getAllDisputes();
            res.json(disputes);
        } catch (error: any) {
            next(error);
        }
    };

    getDisputesByProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const disputes = await this.disputeService.getDisputesByProject(req.params.projectId);
            res.json(disputes);
        } catch (error: any) {
            next(error);
        }
    };

    resolveDispute = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { resolution, status } = req.body;
            const updatedDispute = await this.disputeService.resolveDispute(
                req.params.id,
                req.user!.id,
                resolution,
                status
            );
            res.json(updatedDispute);
        } catch (error: any) {
            next(error);
        }
    };
}
