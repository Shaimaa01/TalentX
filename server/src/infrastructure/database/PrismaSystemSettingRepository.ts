import { PrismaClient } from '@prisma/client';
import { ISystemSetting, ISystemSettingRepository } from '../../domain/repositories/ISystemSettingRepository';

export class PrismaSystemSettingRepository implements ISystemSettingRepository {
    constructor(private prisma: PrismaClient) { }

    async findByKey(key: string): Promise<ISystemSetting | null> {
        return this.prisma.systemSetting.findUnique({
            where: { key }
        });
    }

    async update(key: string, value: string): Promise<ISystemSetting> {
        return this.prisma.systemSetting.update({
            where: { key },
            data: { value }
        });
    }

    async upsert(key: string, value: string): Promise<ISystemSetting> {
        return this.prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });
    }

    async findAll(): Promise<ISystemSetting[]> {
        return this.prisma.systemSetting.findMany();
    }
}
