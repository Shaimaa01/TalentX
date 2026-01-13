import { Milestone } from '@prisma/client';

export interface IMilestoneRepository {
    create(data: any): Promise<Milestone>;
    findById(id: string): Promise<Milestone | null>;
    findByProjectId(projectId: string): Promise<Milestone[]>;
    updateStatus(id: string, status: string): Promise<Milestone>;
    update(id: string, data: any): Promise<Milestone>;
    delete(id: string): Promise<void>;
}
