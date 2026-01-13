
import { Request, Response } from 'express';
import { DisputeService } from '../../application/services/DisputeService';

export class DisputeController {
    constructor(
        private disputeService: DisputeService
    ) { }

    createDispute = async (req: Request, res: Response) => {
        try {
            const dispute = await this.disputeService.createDispute(req.user!.id, req.body);
            res.status(201).json(dispute);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getAllDisputes = async (req: Request, res: Response) => {
        try {
            const disputes = await this.disputeService.getAllDisputes();
            res.json(disputes);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getDisputesByProject = async (req: Request, res: Response) => {
        try {
            const disputes = await this.disputeService.getDisputesByProject(req.params.projectId);
            res.json(disputes);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    resolveDispute = async (req: Request, res: Response) => {
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
            res.status(400).json({ error: error.message });
        }
    };
}
