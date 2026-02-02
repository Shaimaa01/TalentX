import { Request, Response, NextFunction } from 'express';
import { HireRequestService } from '../../application/services/HireRequestService';
import { CreateHireRequestSchema } from '../../application/dtos/HireRequestDTO';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class HireRequestController {
    private hireRequestService: HireRequestService;

    constructor({ hireRequestService }: { hireRequestService: HireRequestService }) {
        this.hireRequestService = hireRequestService;
    }

    createHireRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validation = CreateHireRequestSchema.safeParse(req.body);
            if (!validation.success) {
                return next(new ErrorApp("Validation Error", 400, JSON.stringify(validation.error.issues)));
            }
            const request = await this.hireRequestService.createHireRequest(validation.data);
            res.status(201).json(request);
        } catch (error: any) {
            next(error);
        }
    };

    listHireRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const requests = await this.hireRequestService.listHireRequests();
            res.json(requests);
        } catch (error: any) {
            next(error);
        }
    };

    updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const request = await this.hireRequestService.updateStatus(id, status);
            res.json(request);
        } catch (error: any) {
            next(error);
        }
    };
}
