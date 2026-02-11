import { Request, Response, NextFunction } from 'express';
import { SystemSettingService } from '../../application/services/SystemSettingService';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class SystemSettingController {
    private systemSettingService: SystemSettingService;

    constructor({ systemSettingService }: { systemSettingService: SystemSettingService }) {
        this.systemSettingService = systemSettingService;
    }

    getMaintenanceMode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const enabled = await this.systemSettingService.getMaintenanceMode();
            res.json({ enabled });
        } catch (error: any) {
            next(error);
        }
    };

    setMaintenanceMode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { enabled } = req.body;
            await this.systemSettingService.setMaintenanceMode(enabled);
            res.json({ success: true, enabled });
        } catch (error: any) {
            next(error);
        }
    };

    setPlatformCommission = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { value } = req.body;
            await this.systemSettingService.setPlatformCommission(value);
            res.json({ success: true, value });
        } catch (error: any) {
            next(error);
        }
    };

    setAutomaticVetting = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { enabled } = req.body;
            await this.systemSettingService.setAutomaticVetting(enabled);
            res.json({ success: true, enabled });
        } catch (error: any) {
            next(error);
        }
    };

    getAllSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const settings = await this.systemSettingService.getAllSettings();
            res.json(settings);
        } catch (error: any) {
            next(error);
        }
    };
}
