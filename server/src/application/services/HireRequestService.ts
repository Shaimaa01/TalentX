import { IHireRequestRepository } from '../../domain/repositories/IHireRequestRepository';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { ITalentRepository } from '../../domain/repositories/ITalentRepository';
import { IAgencyRepository } from '../../domain/repositories/IAgencyRepository';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { CreateHireRequestDTO } from '../dtos/HireRequestDTO';

export class HireRequestService {
    constructor(
        private hireRequestRepo: IHireRequestRepository,
        private notificationRepo: INotificationRepository,
        private talentRepo: ITalentRepository,
        private agencyRepo: IAgencyRepository,
        private projectRepo: IProjectRepository
    ) { }

    async createHireRequest(dto: CreateHireRequestDTO) {
        // Parse metadata
        let extraData: any = {};
        if (dto.data) {
            try {
                extraData = JSON.parse(dto.data);
            } catch (e) {
                console.error("Failed to parse hire request extra data", e);
            }
        }

        let request;

        if (dto.matched_talent_id && extraData.projectId) {
            request = await this.hireRequestRepo.processDirectHire(dto, extraData);

            // Post-transaction notifications
            const talent = await this.talentRepo.findById(dto.matched_talent_id);
            if (talent) {
                await this.notificationRepo.create({
                    type: 'hired',
                    content: `You have been hired for project by ${dto.client_name}!`,
                    userId: talent.userId,
                    data: JSON.stringify({ projectId: extraData.projectId, clientName: dto.client_name })
                });
                // Admin notification skipped or can be added
            }

        } else if (dto.matched_agency_id && extraData.projectId) {
            request = await this.hireRequestRepo.processAgencyHire(dto, extraData);

            const agency = await this.agencyRepo.findById(dto.matched_agency_id);
            if (agency) {
                await this.notificationRepo.create({
                    type: 'hired',
                    content: `Your agency has been hired for a project by ${dto.client_name}!`,
                    userId: agency.userId,
                    data: JSON.stringify({ projectId: extraData.projectId, clientName: dto.client_name, role: 'agency' })
                });
            }
        } else {
            // Standard general inquiry
            request = await this.hireRequestRepo.create(dto);
        }

        return request;
    }

    async listHireRequests() {
        return this.hireRequestRepo.findAll();
    }

    async updateStatus(id: string, status: string) {
        const request = await this.hireRequestRepo.updateStatus(id, status);

        if (status === 'matched') {
            // Handle matching logic: Create project membership if possible
            let extraData: any = {};
            if (request.data) {
                try {
                    extraData = JSON.parse(request.data);
                } catch (e) {
                    console.error("Failed to parse request data during matching", e);
                }
            }

            const projectId = extraData.projectId;
            const talentId = request.matched_talent_id;

            if (projectId && talentId) {
                // Check if membership already exists to avoid duplicates
                // (Though DB should have unique constraint, safe to check or handle error)
                try {
                    await this.projectRepo.addProjectMembership({
                        projectId,
                        talentId,
                        role: 'Hired Talent',
                        rateType: extraData.rateType || 'hourly',
                        rateAmount: parseFloat(extraData.rateAmount || "0")
                    });

                    // Notify talent they have been matched/hired
                    const talent = await this.talentRepo.findById(talentId);
                    if (talent) {
                        await this.notificationRepo.create({
                            type: 'hired',
                            content: `Good news! Your match for project "${projectId}" has been finalized.`,
                            userId: talent.userId,
                            data: JSON.stringify({ projectId, status: 'matched' })
                        });
                    }
                } catch (e) {
                    console.error("[HireRequestService] Failed to create membership or notify talent on match", e);
                }
            }
        }

        return request;
    }
}
