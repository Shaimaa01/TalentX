import { PrismaClient } from '@prisma/client';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export class PrismaTaskRepository implements ITaskRepository {
    private prisma: PrismaClient;

    constructor({ prisma }: { prisma: PrismaClient }) {
        this.prisma = prisma;
    }
    async create(data: any): Promise<any> {
        return this.prisma.task.create({
            data,
            include: { project: true },
        });
    }

    async update(id: string, data: any): Promise<any> {
        return this.prisma.task.update({
            where: { id },
            data,
            include: { project: true },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.task.delete({ where: { id } });
    }

    async findById(id: string): Promise<any | null> {
        return this.prisma.task.findUnique({
            where: { id },
            include: { project: true },
        });
    }

    async findAllByProject(projectId?: string): Promise<any[]> {
        return this.prisma.task.findMany({
            where: projectId ? { projectId } : {},
            include: {
                assignee: {
                    select: {
                        id: true,
                        full_name: true,
                        avatar_url: true,
                    },
                },
            },
        });
    }
}
