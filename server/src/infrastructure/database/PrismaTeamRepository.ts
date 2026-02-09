import { PrismaClient } from '@prisma/client';
import { ITeamRepository } from '../../domain/repositories/ITeamRepository';

export class PrismaTeamRepository implements ITeamRepository {
    private prisma: PrismaClient;

    constructor({ prisma }: { prisma: PrismaClient }) {
        this.prisma = prisma;
    }
    async findAll(): Promise<any[]> {
        return this.prisma.team.findMany({
            include: { members: { include: { talent: { include: { user: true } } } } }
        });
    }

    async findById(id: string): Promise<any | null> {
        return this.prisma.team.findUnique({
            where: { id },
            include: { members: { include: { talent: { include: { user: true } } } } },
        });
    }

    async findTalentsBySkills(skills: string[], limit: number): Promise<any[]> {
        const whereClause =
            skills.length > 0
                ? {
                      OR: skills.map((skill: string) => ({
                          skills: {
                              contains: skill,
                              mode: 'insensitive',
                          },
                      })),
                  }
                : {};

        return this.prisma.talent.findMany({
            where: whereClause as any,
            include: {
                user: {
                    select: {
                        full_name: true,
                        avatar_url: true,
                    },
                },
            },
            take: limit,
        });
    }

    async addProjectMembership(data: any): Promise<any> {
        return this.prisma.projectMembership.create({ data });
    }

    async findProjectMembership(projectId: string, talentId: string): Promise<any | null> {
        return this.prisma.projectMembership.findUnique({
            where: { projectId_talentId: { projectId, talentId } }
        });
    }
}
