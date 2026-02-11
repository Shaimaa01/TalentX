import { Request, Response, NextFunction } from 'express';
import { AgencyService } from '../../application/services/AgencyService';
import { UpdateAgencySchema } from '../../application/dtos/AgencyDTO';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class AgencyController {
    private agencyService: AgencyService;

    constructor({ agencyService }: { agencyService: AgencyService }) {
        this.agencyService = agencyService;
    }

    getAllAgencies = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const agencies = await this.agencyService.getAllAgencies();
            res.json(agencies);
        } catch (error: any) {
            next(error);
        }
    };

    getAgencyById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const agency = await this.agencyService.getAgencyById(req.params.id);
            res.json(agency);
        } catch (error: any) {
            next(error);
        }
    };

    getAgencyByUserId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const agency = await this.agencyService.getAgencyByUserId(req.params.userId);
            res.json(agency);
        } catch (error: any) {
            next(error);
        }
    };

    updateAgency = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationResult = UpdateAgencySchema.safeParse(req.body);
            if (!validationResult.success) {
                return next(new ErrorApp("Validation Error", 400, JSON.stringify(validationResult.error.issues)));
            }

            const updatedAgency = await this.agencyService.updateAgency(
                req.params.id,
                validationResult.data
            );
            res.json(updatedAgency);
        } catch (error: any) {
            next(error);
        }
    };
}
