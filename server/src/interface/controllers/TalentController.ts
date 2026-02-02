import { Request, Response, NextFunction } from 'express';
import { TalentService } from '../../application/services/TalentService';
import { UpdateTalentSchema } from '../../application/dtos/TalentDTO';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class TalentController {
    private talentService: TalentService;

    constructor({ talentService }: { talentService: TalentService }) {
        this.talentService = talentService;
    }

    getAllTalents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const talents = await this.talentService.getAllTalents();
            res.json(talents);
        } catch (error: any) {
            next(error);
        }
    };

    getTalentById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const talent = await this.talentService.getTalentById(req.params.id);
            res.json(talent);
        } catch (error: any) {
            next(error);
        }
    };

    getTalentByUserId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const talent = await this.talentService.getTalentByUserId(req.params.userId);
            res.json(talent);
        } catch (error: any) {
            next(error);
        }
    };

    updateTalent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationResult = UpdateTalentSchema.safeParse(req.body);
            if (!validationResult.success) {
                return next(new ErrorApp("Validation Error", 400, JSON.stringify(validationResult.error.issues)));
            }

            const updatedTalent = await this.talentService.updateTalent(req.params.id, validationResult.data);
            res.json(updatedTalent);
        } catch (error: any) {
            next(error);
        }
    };
}
