
import { PrismaClient, Dispute } from '@prisma/client';
import { IDisputeRepository } from '../../domain/repositories/IDisputeRepository';

export class PrismaDisputeRepository implements IDisputeRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: any): Promise<Dispute> {
        return this.prisma.dispute.create({
            data,
            include: { initiator: true, project: true }
        });
    }

    async findById(id: string): Promise<Dispute | null> {
        return this.prisma.dispute.findUnique({
            where: { id },
            include: { initiator: true, project: true, admin: true }
        });
    }

    async findByProjectId(projectId: string): Promise<Dispute[]> {
        return this.prisma.dispute.findMany({
            where: { projectId },
            include: { initiator: true, admin: true }
        });
    }

    async findAll(): Promise<Dispute[]> {
        return this.prisma.dispute.findMany({
            include: { initiator: true, project: true, admin: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async update(id: string, data: Partial<Dispute>): Promise<Dispute> {
        return this.prisma.dispute.update({
            where: { id },
            data,
            include: { initiator: true, project: true, admin: true }
        });
    }
}
