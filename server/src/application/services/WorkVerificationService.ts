import { ITimeLogRepository } from '../../domain/repositories/ITimeLogRepository';
import { IMilestoneRepository } from '../../domain/repositories/IMilestoneRepository';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { ITalentRepository } from '../../domain/repositories/ITalentRepository';
import { TimeLog, Milestone } from '@prisma/client';

export class WorkVerificationService {
    private timeLogRepo: ITimeLogRepository;
    private milestoneRepo: IMilestoneRepository;
    private projectRepo: IProjectRepository;
    private talentRepo: ITalentRepository;
    private notificationRepo: INotificationRepository;

    constructor({
        timeLogRepo,
        milestoneRepo,
        projectRepo,
        talentRepo,
        notificationRepo,
    }: {
        timeLogRepo: ITimeLogRepository;
        milestoneRepo: IMilestoneRepository;
        projectRepo: IProjectRepository;
        talentRepo: ITalentRepository;
        notificationRepo: INotificationRepository;
    }) {
        this.timeLogRepo = timeLogRepo;
        this.milestoneRepo = milestoneRepo;
        this.projectRepo = projectRepo;
        this.talentRepo = talentRepo;
        this.notificationRepo = notificationRepo;
    }

    // --- Time Log Operations ---

    async logTime(
        userId: string,
        data: { projectId: string; hours: number; description: string; date: string }
    ): Promise<TimeLog> {
        const talent = await this.talentRepo.findByUserId(userId);
        if (!talent) throw new Error('Talent profile not found');

        const project = await this.projectRepo.findById(data.projectId);
        if (!project) throw new Error('Project not found');

        const timeLog = await this.timeLogRepo.create({
            projectId: data.projectId,
            talentId: talent.id,
            hours: data.hours,
            description: data.description,
            date: new Date(data.date),
            status: 'pending',
        });

        // Notify Client
        await this.notificationRepo.create({
            type: 'time_log_submitted',
            content: `${talent.user.full_name} logged ${data.hours} hours for project "${project.name}".`,
            userId: project.clientId,
            data: JSON.stringify({ projectId: project.id, timeLogId: timeLog.id }),
        });

        return timeLog;
    }

    async approveTimeLog(timeLogId: string): Promise<TimeLog> {
        const timeLog = await this.timeLogRepo.updateStatus(timeLogId, 'approved');

        // Notify Talent
        const talent = await this.talentRepo.findById(timeLog.talentId);
        if (talent) {
            await this.notificationRepo.create({
                type: 'time_log_approved',
                content: `Your time log for ${timeLog.hours} hours has been approved.`,
                userId: talent.userId,
            });
        }

        return timeLog;
    }

    async rejectTimeLog(timeLogId: string): Promise<TimeLog> {
        return this.timeLogRepo.updateStatus(timeLogId, 'rejected');
    }

    async getTimeLogsByProject(projectId: string): Promise<TimeLog[]> {
        return this.timeLogRepo.findByProjectId(projectId);
    }

    // --- Milestone Operations ---

    async createMilestone(data: {
        projectId: string;
        title: string;
        description: string;
        amount: number;
        due_date?: string;
    }): Promise<Milestone> {
        return this.milestoneRepo.create({
            ...data,
            due_date: data.due_date ? new Date(data.due_date) : null,
            status: 'pending',
        });
    }

    async requestMilestoneApproval(milestoneId: string): Promise<Milestone> {
        const milestone = await this.milestoneRepo.updateStatus(milestoneId, 'requested');
        const project = await this.projectRepo.findById(milestone.projectId);

        if (project) {
            // Notify Client
            await this.notificationRepo.create({
                type: 'milestone_approval_requested',
                content: `Approval requested for milestone "${milestone.title}" on project "${project.name}".`,
                userId: project.clientId,
                data: JSON.stringify({ projectId: project.id, milestoneId: milestone.id }),
            });
        }

        return milestone;
    }

    async approveMilestone(milestoneId: string): Promise<Milestone> {
        const milestone = await this.milestoneRepo.updateStatus(milestoneId, 'approved');
        const project = await this.projectRepo.findById(milestone.projectId);

        if (project) {
            // Update project escrow balance if applicable (legacy)
            // For now just status change

            // Notify Talent
            if (project.talentId) {
                const talent = await this.talentRepo.findById(project.talentId);
                if (talent) {
                    await this.notificationRepo.create({
                        type: 'milestone_approved',
                        content: `Milestone "${milestone.title}" has been approved. Funds are ready for release.`,
                        userId: talent.userId,
                        data: JSON.stringify({ projectId: project.id, milestoneId: milestone.id }),
                    });
                }
            }
        }

        return milestone;
    }

    async getMilestonesByProject(projectId: string): Promise<Milestone[]> {
        return this.milestoneRepo.findByProjectId(projectId);
    }
}
