import { IDisputeRepository } from '../../domain/repositories/IDisputeRepository';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { Dispute } from '@prisma/client';

export class DisputeService {
    private disputeRepo: IDisputeRepository;
    private projectRepo: IProjectRepository;

    constructor({
        disputeRepo,
        projectRepo,
    }: {
        disputeRepo: IDisputeRepository;
        projectRepo: IProjectRepository;
    }) {
        this.disputeRepo = disputeRepo;
        this.projectRepo = projectRepo;
    }

    async createDispute(userId: string, data: any): Promise<Dispute> {
        // 1. Create Dispute
        const dispute = await this.disputeRepo.create({
            ...data,
            initiatorId: userId,
            status: 'open',
        });

        // 2. Freeze Project Logic
        // We update the project paymentStatus to 'frozen' to lock funds
        if (data.projectId) {
            await this.projectRepo.update(data.projectId, {
                paymentStatus: 'frozen',
            });
        }

        return dispute;
    }

    async resolveDispute(
        disputeId: string,
        adminId: string,
        resolution: string,
        outcome: 'resolved' | 'dismissed'
    ): Promise<Dispute> {
        const dispute = await this.disputeRepo.findById(disputeId);
        if (!dispute) throw new Error('Dispute not found');

        // 1. Update Dispute
        const updatedDispute = await this.disputeRepo.update(disputeId, {
            status: outcome,
            resolution,
            adminId,
        });

        // 2. Unfreeze Project if resolved/dismissed
        // If dismissed -> return to previous state (assume pending/active)
        // If resolved -> usually means funds are handled manually or unlocked.
        // For now, we set paymentStatus back to 'pending' to allow operations again,
        // or 'released' if the resolution was to release funds.
        // We'll default to 'pending' (active) so work can resume or standard payment flow can continue.

        if (dispute.projectId) {
            await this.projectRepo.update(dispute.projectId, {
                paymentStatus: 'pending',
            });
        }

        return updatedDispute;
    }

    async getDisputesByProject(projectId: string): Promise<Dispute[]> {
        return this.disputeRepo.findByProjectId(projectId);
    }

    async getAllDisputes(): Promise<Dispute[]> {
        return this.disputeRepo.findAll();
    }
}
