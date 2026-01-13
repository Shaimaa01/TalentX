
import { Contract } from '@prisma/client';

export interface IContractRepository {
    create(data: Partial<Contract>): Promise<Contract>;
    findById(id: string): Promise<Contract | null>;
    findByProjectId(projectId: string): Promise<Contract[]>;
    findByUserId(userId: string): Promise<Contract[]>;
    update(id: string, data: Partial<Contract>): Promise<Contract>;
}
