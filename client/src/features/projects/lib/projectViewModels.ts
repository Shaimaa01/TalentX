import type { Project } from '@/shared/types';

export function withClientProjectDefaults(project: any): any {
    return {
        ...project,
        progress: project.progress || 0,
        budget_spent: project.budget_spent || 0,
        total_budget: project.total_budget || 0,
        next_milestone: project.next_milestone || '',
        team_members: project.team_members || [],
    };
}

export function withClientProjectsDefaults(projects: any[]): any[] {
    return projects.map(withClientProjectDefaults);
}

export function filterAgencyAssignedProjects(projects: any[], agencyId: string): any[] {
    return projects.filter((p: any) => p.assigned_to?.type === 'agency' && p.assigned_to?.id === agencyId);
}
