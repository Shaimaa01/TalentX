
import { Dispute } from '@prisma/client';

export interface IDisputeRepository {
    create(data: Partial<Dispute>): Promise<Dispute>;
    findById(id: string): Promise<Dispute | null>;
    findByProjectId(projectId: string): Promise<Dispute[]>;
    findAll(): Promise<Dispute[]>;
    update(id: string, data: Partial<Dispute>): Promise<Dispute>;
}
