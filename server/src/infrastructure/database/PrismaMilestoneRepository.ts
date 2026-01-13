import { PrismaClient, Milestone } from '@prisma/client';
import { IMilestoneRepository } from '../../domain/repositories/IMilestoneRepository';

export class PrismaMilestoneRepository implements IMilestoneRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: any): Promise<Milestone> {
        return this.prisma.milestone.create({ data });
    }

    async findById(id: string): Promise<Milestone | null> {
        return this.prisma.milestone.findUnique({ where: { id } });
    }

    async findByProjectId(projectId: string): Promise<Milestone[]> {
        return this.prisma.milestone.findMany({
            where: { projectId },
            orderBy: { createdAt: 'asc' }
        });
    }

    async updateStatus(id: string, status: string): Promise<Milestone> {
        return this.prisma.milestone.update({
            where: { id },
            data: { status }
        });
    }

    async update(id: string, data: any): Promise<Milestone> {
        return this.prisma.milestone.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.milestone.delete({ where: { id } });
    }
}
