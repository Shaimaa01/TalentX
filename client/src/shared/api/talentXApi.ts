import { apiClient, API_URL, WS_URL } from './client';
import { Talent, Agency, Team, Subscription, HireRequest, Project, Task, User, Message, FAQ, Testimonial, CaseStudy, BlogPost, AuditLog, GenerateTeamsInput, HireTeamInput } from '@/shared/types';

export { API_URL, WS_URL };

export const talentXApi = {
    auth: {
        login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
            const response = await apiClient.post('/auth/login', {
                email,
                password,
            });

            const { user, token } = response.data;
            if (typeof window !== 'undefined') {
                localStorage.setItem('talentx_user', JSON.stringify(user));
                localStorage.setItem('talentx_token', token);
            }
            return { user, token };
        },
        register: async (data: any): Promise<{ user: User; token: string }> => {
            const response = await apiClient.post('/auth/register', data);

            const { user, token } = response.data;
            if (typeof window !== 'undefined') {
                localStorage.setItem('talentx_user', JSON.stringify(user));
                localStorage.setItem('talentx_token', token);
            }
            return { user, token };
        },
        me: async (): Promise<User> => {
            try {
                const response = await apiClient.get('/auth/me');
                return response.data;
            } catch (error) {
                // Fallback to localStorage if API fails or not logged in
                if (typeof window !== 'undefined') {
                    const stored = localStorage.getItem('talentx_user');
                    if (stored) return JSON.parse(stored);
                }
                throw error;
            }
        },
        logout: async () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('talentx_user');
                localStorage.removeItem('talentx_token');
            }
        },
    },
    entities: {
        Talent: {
            list: async (): Promise<(Talent & { id: string })[]> => {
                const response = await apiClient.get('/talents');
                return response.data;
            },
            getByUserId: async (userId: string): Promise<Talent & { id: string }> => {
                const response = await apiClient.get(`/talents/user/${userId}`);
                return response.data;
            },
            update: async (id: string, data: Partial<Talent>): Promise<Talent & { id: string }> => {
                const response = await apiClient.patch(`/talents/${id}`, data);
                return response.data;
            },
        },
        Agency: {
            list: async (): Promise<(Agency & { id: string })[]> => {
                const response = await apiClient.get('/agencies');
                return response.data;
            },
            getByUserId: async (userId: string): Promise<Agency & { id: string }> => {
                const response = await apiClient.get(`/agencies/user/${userId}`);
                return response.data;
            },
            update: async (id: string, data: Partial<Agency>): Promise<Agency & { id: string }> => {
                const response = await apiClient.patch(`/agencies/${id}`, data);
                return response.data;
            },
        },
        Team: {
            list: async (): Promise<(Team & { id: string })[]> => {
                const response = await apiClient.get('/teams');
                return response.data;
            },
            generate: async (data: GenerateTeamsInput): Promise<any> => {
                // Transform GenerateTeamsInput to backend format
                const backendData = {
                    skills: data.category, // Map category to skills
                    team_size: 3, // Default team size, can be adjusted based on requirements
                    // Additional context can be passed if backend supports it
                    ...(data.budget && { budget: data.budget }),
                    ...(data.timeline && { timeline: data.timeline }),
                    ...(data.description && { description: data.description })
                };
                const response = await apiClient.post('/teams/generate', backendData);
                return response.data;
            },
            hire: async (data: HireTeamInput): Promise<any> => {
                // Transform HireTeamInput to backend format
                // Extract real talent IDs from the team members
                const backendData = {
                    talentIds: data.talentIds || [], // Use the talentIds array directly
                    projectId: data.projectId || '', // Ensure projectId is provided
                    ...(data.startDate && { startDate: data.startDate })
                };
                const response = await apiClient.post('/teams/hire', backendData);
                return response.data;
            },
        },
        Subscription: {
            filter: async (query: any): Promise<Subscription[]> => {
                // Subscriptions are not fully implemented in backend yet, return mock
                return [
                    {
                        user_email: 'demo@example.com',
                        status: 'active',
                    },
                ];
            },
            create: async (data: any) => ({ id: 'sub_123', ...data }),
        },
        HireRequest: {
            list: async (): Promise<HireRequest[]> => {
                const response = await apiClient.get('/hire-requests');
                return response.data;
            },
            create: async (data: any) => {
                const response = await apiClient.post('/hire-requests', data);
                return response.data;
            },
            updateStatus: async (id: string, status: string) => {
                const response = await apiClient.patch(`/hire-requests/${id}/status`, { status });
                return response.data;
            },
        },
        Project: {
            list: async (): Promise<Project[]> => {
                const response = await apiClient.get('/projects');
                return response.data;
            },
            filter: async (query: any): Promise<Project[]> => {
                const response = await apiClient.get('/projects', { params: query });
                return response.data;
            },
            create: async (data: any) => {
                const response = await apiClient.post('/projects', data);
                return response.data;
            },
            update: async (id: string, data: Partial<Project>) => {
                const response = await apiClient.patch(`/projects/${id}`, data);
                return response.data;
            },
            recordPayment: async (data: {
                projectId: string;
                talentId: string;
                amount: number;
            }) => {
                const response = await apiClient.post('/projects/pay', data);
                return response.data;
            },
            delete: async (id: string) => {
                const response = await apiClient.delete(`/projects/${id}`);
                return response.data;
            },
            complete: async (id: string, data: { rating: number; review: string }) => {
                const response = await apiClient.post(`/projects/${id}/complete`, data);
                return response.data;
            },
            releasePayment: async (id: string) => {
                const response = await apiClient.post(`/projects/${id}/release-payment`);
                return response.data;
            },
        },
        Task: {
            list: async (): Promise<Task[]> => {
                const response = await apiClient.get('/tasks');
                return response.data;
            },
            filter: async (query: any): Promise<Task[]> => {
                const response = await apiClient.get('/tasks', { params: query });
                return response.data;
            },
            update: async (id: string, data: Partial<Task>) => {
                const response = await apiClient.patch(`/tasks/${id}`, data);
                return response.data;
            },
            create: async (data: any) => {
                const response = await apiClient.post('/tasks', data);
                return response.data;
            },
            delete: async (id: string) => {
                const response = await apiClient.delete(`/tasks/${id}`);
                return response.data;
            },
        },
        Message: {
            list: async (query?: any): Promise<Message[]> => {
                const response = await apiClient.get('/messages', { params: query });
                return response.data;
            },
            create: async (data: { receiver_id: string; content: string; isSupport?: boolean }) => {
                const response = await apiClient.post('/messages', data);
                return response.data;
            },
            getUnreadCount: async (): Promise<{ general: number; support: number }> => {
                const response = await apiClient.get('/messages/unread');
                return response.data;
            },
            markRead: async (data: { isSupport: boolean; threadUserId?: string }) => {
                const response = await apiClient.post('/messages/read', data);
                return response.data;
            },
        },
        User: {
            list: async (): Promise<User[]> => {
                const response = await apiClient.get('/users');
                return response.data;
            },
            getById: async (id: string): Promise<User> => {
                const response = await apiClient.get(`/users/${id}`);
                return response.data;
            },
            create: async (data: any) => {
                const response = await apiClient.post('/users', data);
                return response.data;
            },
            update: async (id: string, data: Partial<User>) => {
                const response = await apiClient.patch(`/users/${id}`, data);
                return response.data;
            },
            delete: async (id: string) => {
                const response = await apiClient.delete(`/users/${id}`);
                return response.data;
            },
            toggleStatus: async (id: string, status: 'active' | 'disabled') => {
                const response = await apiClient.patch(`/users/${id}`, { status });
                return response.data;
            },
        },
        Notification: {
            list: async (userId?: string): Promise<any[]> => {
                const response = await apiClient.get('/notifications');
                return response.data;
            },
            markRead: async (id: string) => {
                const response = await apiClient.patch(`/notifications/${id}/read`);
                return response.data;
            },
        },
        Application: {
            list: async (): Promise<any[]> => {
                const response = await apiClient.get('/applications/list');
                return response.data;
            },
            notifications: async (): Promise<any[]> => {
                const response = await apiClient.get('/applications/notifications');
                return response.data;
            },
            updateStatus: async (id: string, data: { status: string; type: string }) => {
                const response = await apiClient.patch(`/applications/status/${id}`, data);
                return response.data;
            },
            delete: async (id: string) => {
                const response = await apiClient.delete(`/applications/${id}`);
                return response.data;
            },
            getSheetUrl: async () => {
                const response = await apiClient.get('/applications/sheet-url');
                return response.data;
            },
        },
        Admin: {
            getAnalytics: async () => {
                // Mock analytics data for now
                return {
                    revenue: {
                        total: 124500,
                        growth: 12,
                        history: [
                            { month: 'Jan', value: 85000 },
                            { month: 'Feb', value: 92000 },
                            { month: 'Mar', value: 105000 },
                            { month: 'Apr', value: 112000 },
                            { month: 'May', value: 124500 },
                        ],
                    },
                    users: {
                        total: 450,
                        growth: 24,
                        distribution: { talent: 300, agency: 50, client: 100 },
                    },
                    projects: {
                        total: 82,
                        active: 45,
                        completed: 37,
                    },
                };
            },
            getAuditLogs: async (filters?: {
                entityType?: string;
                startDate?: string;
                endDate?: string;
            }): Promise<AuditLog[]> => {
                const response = await apiClient.get('/admin/audit-logs', { params: filters });
                return response.data;
            },
        },
        CMS: {
            FAQ: {
                list: async (): Promise<FAQ[]> => (await apiClient.get('/cms/faqs')).data,
                create: async (data: Partial<FAQ>) =>
                    (await apiClient.post('/cms/faqs', data)).data,
                update: async (id: string, data: Partial<FAQ>) =>
                    (await apiClient.patch(`/cms/faqs/${id}`, data)).data,
                delete: async (id: string) => (await apiClient.delete(`/cms/faqs/${id}`)).data,
            },
            Testimonial: {
                list: async (): Promise<Testimonial[]> =>
                    (await apiClient.get('/cms/testimonials')).data,
                create: async (data: Partial<Testimonial>) =>
                    (await apiClient.post('/cms/testimonials', data)).data,
                update: async (id: string, data: Partial<Testimonial>) =>
                    (await apiClient.patch(`/cms/testimonials/${id}`, data)).data,
                delete: async (id: string) =>
                    (await apiClient.delete(`/cms/testimonials/${id}`)).data,
            },
            CaseStudy: {
                list: async (): Promise<CaseStudy[]> =>
                    (await apiClient.get('/cms/case-studies')).data,
                create: async (data: Partial<CaseStudy>) =>
                    (await apiClient.post('/cms/case-studies', data)).data,
                update: async (id: string, data: Partial<CaseStudy>) =>
                    (await apiClient.patch(`/cms/case-studies/${id}`, data)).data,
                delete: async (id: string) =>
                    (await apiClient.delete(`/cms/case-studies/${id}`)).data,
            },
            BlogPost: {
                list: async (): Promise<BlogPost[]> =>
                    (await apiClient.get('/cms/blog-posts')).data,
                getBySlug: async (slug: string): Promise<BlogPost> =>
                    (await apiClient.get(`/cms/blog-posts/slug/${slug}`)).data,
                create: async (data: Partial<BlogPost>) =>
                    (await apiClient.post('/cms/blog-posts', data)).data,
                update: async (id: string, data: Partial<BlogPost>) =>
                    (await apiClient.patch(`/cms/blog-posts/${id}`, data)).data,
                delete: async (id: string) =>
                    (await apiClient.delete(`/cms/blog-posts/${id}`)).data,
            },
        },
    },
    Legal: {
        Contracts: {
            listByProject: async (projectId: string): Promise<any[]> => {
                const response = await apiClient.get(`/contracts/project/${projectId}`);
                return response.data;
            },
            create: async (data: any) => {
                const response = await apiClient.post('/contracts', data);
                return response.data;
            },
            sign: async (id: string, signature: string) => {
                const response = await apiClient.post(`/contracts/${id}/sign`, { signature });
                return response.data;
            },
        },
        Disputes: {
            listByProject: async (projectId: string): Promise<any[]> => {
                const response = await apiClient.get(`/disputes/project/${projectId}`);
                return response.data;
            },
            create: async (data: any) => {
                const response = await apiClient.post('/disputes', data);
                return response.data;
            },
            // Admin
            listAll: async (): Promise<any[]> => {
                const response = await apiClient.get('/disputes/admin/all');
                return response.data;
            },
            resolve: async (id: string, data: { resolution: string; status: string }) => {
                const response = await apiClient.post(`/disputes/${id}/resolve`, data);
                return response.data;
            },
        },
    },
    integrations: {
        Core: {
            InvokeLLM: async (params: any) => {
                if (params.prompt.includes('team compositions')) {
                    return {
                        teams: [
                            {
                                team_name: 'The A-Team',
                                talent_ids: ['1', '2', '3'],
                                rationale: 'Perfect blend of frontend, backend, and design skills.',
                                hourly_rate: 250,
                            },
                        ],
                    };
                }
                return { matches: [] };
            },
        },
    },
    WorkVerification: {
        TimeLogs: {
            listByProject: async (projectId: string): Promise<any[]> => {
                const response = await apiClient.get(
                    `/work-verification/time-logs/project/${projectId}`
                );
                return response.data;
            },
            log: async (data: {
                projectId: string;
                hours: number;
                description: string;
                date: string;
            }) => {
                const response = await apiClient.post('/work-verification/time-logs', data);
                return response.data;
            },
            approve: async (id: string) => {
                const response = await apiClient.patch(
                    `/work-verification/time-logs/${id}/approve`
                );
                return response.data;
            },
            reject: async (id: string) => {
                const response = await apiClient.patch(`/work-verification/time-logs/${id}/reject`);
                return response.data;
            },
        },
        Milestones: {
            listByProject: async (projectId: string): Promise<any[]> => {
                const response = await apiClient.get(
                    `/work-verification/milestones/project/${projectId}`
                );
                return response.data;
            },
            create: async (data: {
                projectId: string;
                title: string;
                description: string;
                amount: number;
                due_date?: string;
            }) => {
                const response = await apiClient.post('/work-verification/milestones', data);
                return response.data;
            },
            requestApproval: async (id: string) => {
                const response = await apiClient.patch(
                    `/work-verification/milestones/${id}/request-approval`
                );
                return response.data;
            },
            approve: async (id: string) => {
                const response = await apiClient.patch(
                    `/work-verification/milestones/${id}/approve`
                );
                return response.data;
            },
        },
    },
    Settings: {
        getMaintenanceMode: async () => {
            const response = await apiClient.get('/settings/maintenance');
            return response.data;
        },
        setMaintenanceMode: async (enabled: boolean) => {
            const response = await apiClient.post('/settings/maintenance', { enabled });
            return response.data;
        },
        updateCommission: async (value: number) => {
            const response = await apiClient.post('/settings/commission', { value });
            return response.data;
        },
        updateVetting: async (enabled: boolean) => {
            const response = await apiClient.post('/settings/vetting', { enabled });
            return response.data;
        },
        getAll: async () => {
            const response = await apiClient.get('/settings/all');
            return response.data;
        },
    },
};
