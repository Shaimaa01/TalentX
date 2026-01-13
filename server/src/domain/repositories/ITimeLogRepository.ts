import { TimeLog } from '@prisma/client';

export interface ITimeLogRepository {
    create(data: any): Promise<TimeLog>;
    findById(id: string): Promise<TimeLog | null>;
    findByProjectId(projectId: string): Promise<TimeLog[]>;
    findByTalentId(talentId: string): Promise<TimeLog[]>;
    updateStatus(id: string, status: string): Promise<TimeLog>;
    delete(id: string): Promise<void>;
}
