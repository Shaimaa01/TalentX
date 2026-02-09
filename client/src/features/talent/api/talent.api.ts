import { apiClient } from "@/shared/api/client";
import { Talent } from "@/entities/talent/model/types";
import { normalizeTalent, normalizeTalents } from '../lib/normalizeTalent';

export interface TalentFilters {
    skill?: string;
    minRate?: number;
    maxRate?: number;
    availability?: string;
}

export const talentApi = {
    getAll: async (filters?: TalentFilters): Promise<Talent[]> => {
        const response = await apiClient.get<Talent[]>('/talents', { params: filters });
        return normalizeTalents(response.data);
    },

    getById: async (id: string): Promise<Talent> => {
        const response = await apiClient.get<Talent>(`/talents/${id}`);
        return normalizeTalent(response.data);
    }
};
