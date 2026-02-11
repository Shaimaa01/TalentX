import { Request, Response, NextFunction } from 'express';
import { TeamService } from '../../application/services/TeamService';
import { GenerateTeamSchema, HireTeamSchema } from '../../application/dtos/TeamDTO';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class TeamController {
    private teamService: TeamService;

    constructor({ teamService }: { teamService: TeamService }) {
        this.teamService = teamService;
    }

    listTeams = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const teams = await this.teamService.listTeams();
            res.json(teams);
        } catch (error: any) {
            next(error);
        }
    };

    getTeam = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const team = await this.teamService.getTeamById(req.params.id);
            res.json(team);
        } catch (error: any) {
            next(error);
        }
    };

    generateTeams = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validation = GenerateTeamSchema.safeParse(req.body);
            if (!validation.success) {
                return next(new ErrorApp("Validation Error", 400, JSON.stringify(validation.error.issues)));
            }
            const teams = await this.teamService.generateTeams(validation.data);
            res.json(teams);
        } catch (error: any) {
            next(error);
        }
    };

    hireTeam = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validation = HireTeamSchema.safeParse(req.body);
            if (!validation.success) {
                return next(new ErrorApp("Validation Error", 400, JSON.stringify(validation.error.issues)));
            }
            const result = await this.teamService.hireTeam(validation.data);
            res.json(result);
        } catch (error: any) {
            next(error);
        }
    };
}
