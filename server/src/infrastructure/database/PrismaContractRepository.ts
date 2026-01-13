
import { PrismaClient, Contract } from '@prisma/client';
import { IContractRepository } from '../../domain/repositories/IContractRepository';

export class PrismaContractRepository implements IContractRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: any): Promise<Contract> {
        return this.prisma.contract.create({ data });
    }

    async findById(id: string): Promise<Contract | null> {
        return this.prisma.contract.findUnique({ where: { id } });
    }

    async findByProjectId(projectId: string): Promise<Contract[]> {
        return this.prisma.contract.findMany({ where: { projectId } });
    }

    async findByUserId(userId: string): Promise<Contract[]> {
        return this.prisma.contract.findMany({
            where: {
                OR: [
                    { clientId: userId },
                    { talentId: userId },
                    { agencyId: userId }
                ]
            }
        });
    }

    async update(id: string, data: Partial<Contract>): Promise<Contract> {
        return this.prisma.contract.update({
            where: { id },
            data
        });
    }
}
