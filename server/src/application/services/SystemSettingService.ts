import { ISystemSettingRepository } from '../../domain/repositories/ISystemSettingRepository';

export class SystemSettingService {
    constructor(private settingRepo: ISystemSettingRepository) { }

    async getMaintenanceMode(): Promise<boolean> {
        const setting = await this.settingRepo.findByKey('maintenance_mode');
        return setting?.value === 'true';
    }

    async setMaintenanceMode(enabled: boolean): Promise<void> {
        await this.settingRepo.upsert('maintenance_mode', enabled ? 'true' : 'false');
    }

    async getPlatformCommission(): Promise<number> {
        const setting = await this.settingRepo.findByKey('platform_commission');
        return setting ? parseFloat(setting.value) : 12.0; // Default 12%
    }

    async setPlatformCommission(value: number): Promise<void> {
        await this.settingRepo.upsert('platform_commission', value.toString());
    }

    async getAutomaticVetting(): Promise<boolean> {
        const setting = await this.settingRepo.findByKey('automatic_vetting');
        return setting?.value === 'true';
    }

    async setAutomaticVetting(enabled: boolean): Promise<void> {
        await this.settingRepo.upsert('automatic_vetting', enabled ? 'true' : 'false');
    }

    async getAllSettings() {
        return this.settingRepo.findAll();
    }
}
