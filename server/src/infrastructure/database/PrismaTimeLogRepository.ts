import { PrismaClient, TimeLog } from '@prisma/client';
import { ITimeLogRepository } from '../../domain/repositories/ITimeLogRepository';

export class PrismaTimeLogRepository implements ITimeLogRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: any): Promise<TimeLog> {
        return this.prisma.timeLog.create({ data });
    }

    async findById(id: string): Promise<TimeLog | null> {
        return this.prisma.timeLog.findUnique({ where: { id } });
    }

    async findByProjectId(projectId: string): Promise<TimeLog[]> {
        return this.prisma.timeLog.findMany({
            where: { projectId },
            include: { talent: { include: { user: true } } },
            orderBy: { date: 'desc' }
        });
    }

    async findByTalentId(talentId: string): Promise<TimeLog[]> {
        return this.prisma.timeLog.findMany({
            where: { talentId },
            orderBy: { date: 'desc' }
        });
    }

    async updateStatus(id: string, status: string): Promise<TimeLog> {
        return this.prisma.timeLog.update({
            where: { id },
            data: { status }
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.timeLog.delete({ where: { id } });
    }
}
