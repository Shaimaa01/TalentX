import { Request, Response } from 'express';
import { SystemSettingService } from '../../application/services/SystemSettingService';

export class SystemSettingController {
    constructor(private systemSettingService: SystemSettingService) { }

    getMaintenanceMode = async (req: Request, res: Response) => {
        try {
            const enabled = await this.systemSettingService.getMaintenanceMode();
            res.json({ enabled });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    setMaintenanceMode = async (req: Request, res: Response) => {
        try {
            const { enabled } = req.body;
            await this.systemSettingService.setMaintenanceMode(enabled);
            res.json({ success: true, enabled });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    setPlatformCommission = async (req: Request, res: Response) => {
        try {
            const { value } = req.body;
            await this.systemSettingService.setPlatformCommission(value);
            res.json({ success: true, value });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    setAutomaticVetting = async (req: Request, res: Response) => {
        try {
            const { enabled } = req.body;
            await this.systemSettingService.setAutomaticVetting(enabled);
            res.json({ success: true, enabled });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getAllSettings = async (req: Request, res: Response) => {
        try {
            const settings = await this.systemSettingService.getAllSettings();
            res.json(settings);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
