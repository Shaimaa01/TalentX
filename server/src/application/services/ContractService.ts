import { IContractRepository } from '../../domain/repositories/IContractRepository';
import { ITalentRepository } from '../../domain/repositories/ITalentRepository';
import { IAgencyRepository } from '../../domain/repositories/IAgencyRepository';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { Contract } from '@prisma/client';

export class ContractService {
    constructor(
        private contractRepo: IContractRepository,
        private talentRepo: ITalentRepository,
        private agencyRepo: IAgencyRepository,
        private projectRepo: IProjectRepository,
        private notificationRepo: INotificationRepository
    ) { }

    async createContract(userId: string, data: any): Promise<Contract> {
        // Auto-link talent/agency from project if not provided
        if (data.projectId && (!data.talentId && !data.agencyId)) {
            const project = await this.projectRepo.findById(data.projectId);
            if (project) {
                // Try primary assignment first
                data.talentId = project.talentId;
                data.agencyId = project.agencyId;

                // If no primary talent, pick the first member if available
                if (!data.talentId && project.memberships && project.memberships.length > 0) {
                    data.talentId = project.memberships[0].talentId;
                }
            }
        }

        return this.contractRepo.create({
            ...data,
            status: 'draft',
            clientId: userId
        });
    }

    async getContractsByProject(projectId: string): Promise<Contract[]> {
        return this.contractRepo.findByProjectId(projectId);
    }

    async getContractById(id: string): Promise<Contract | null> {
        return this.contractRepo.findById(id);
    }

    async signContract(id: string, userId: string, signature: string): Promise<Contract> {
        const contract = await this.contractRepo.findById(id);
        if (!contract) {
            throw new Error('Contract not found');
        }

        const updates: Partial<Contract> = {};
        const now = new Date();

        if (userId === contract.clientId) {
            updates.clientSignature = signature;
            updates.clientSignedAt = now;
        } else {
            // Check if user is the assigned talent or agency
            const [talent, agency] = await Promise.all([
                this.talentRepo.findByUserId(userId),
                this.agencyRepo.findByUserId(userId)
            ]);

            const isAssignedTalent = talent && (talent.id === contract.talentId);
            const isAssignedAgency = agency && (agency.id === contract.agencyId);

            let isProjectMember = false;
            if (!isAssignedTalent && !isAssignedAgency) {
                const project = await this.projectRepo.findById(contract.projectId);
                if (project && project.memberships) {
                    isProjectMember = project.memberships.some((m: any) => m.talentId === talent?.id);
                }
            }

            if (isAssignedTalent || isAssignedAgency || isProjectMember) {
                updates.contractorSignature = signature;
                updates.contractorSignedAt = now;

                // If contract didn't have talentId/agencyId, backfill it now
                if (!contract.talentId && talent) updates.talentId = talent.id;
                if (!contract.agencyId && agency) updates.agencyId = agency.id;
            } else {
                throw new Error('User not authorized to sign this contract');
            }
        }

        // Check if both signed to activate
        const isClientSigned = updates.clientSignature || contract.clientSignature;
        const isContractorSigned = updates.contractorSignature || contract.contractorSignature;

        if (isClientSigned && isContractorSigned) {
            updates.status = 'active';

            // 1. Notify both parties that the contract is active
            const project = await this.projectRepo.findById(contract.projectId);
            if (project) {
                // Notify Client
                await this.notificationRepo.create({
                    type: 'contract_active',
                    content: `Contract "${contract.title}" for project "${project.name}" is now fully signed and active.`,
                    userId: contract.clientId,
                    data: JSON.stringify({ projectId: project.id, contractId: contract.id })
                });

                // Notify Talent
                if (contract.talentId) {
                    const talent = await this.talentRepo.findById(contract.talentId);
                    if (talent) {
                        await this.notificationRepo.create({
                            type: 'contract_active',
                            content: `Contract "${contract.title}" for project "${project.name}" is now fully signed and active.`,
                            userId: talent.userId,
                            data: JSON.stringify({ projectId: project.id, contractId: contract.id })
                        });
                    }
                }

                // 2. Activate Project if it wasn't already or was in a setup state
                if (project.status === 'pending' || project.status === 'draft') {
                    await this.projectRepo.update(project.id, { status: 'active' });
                }
            }
        } else {
            updates.status = 'pending_signature';
        }

        return this.contractRepo.update(id, updates);
    }
}
