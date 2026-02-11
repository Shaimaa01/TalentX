import type { Talent } from '@/entities/talent/model/types';

export function normalizeTalent(talent: Talent): Talent {
    return {
        ...talent,
        skills: typeof talent.skills === 'string' ? JSON.parse(talent.skills) : talent.skills,
    } as Talent;
}

export function normalizeTalents(talents: Talent[]): Talent[] {
    return talents.map(normalizeTalent);
}
