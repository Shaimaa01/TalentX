import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth.api';
import { AuthState } from '../api/types';

const normalizeRole = (role: unknown) => {
    if (typeof role !== 'string') return role;
    const raw = role.trim().toLowerCase();
    if (raw === 'admin') return 'admin';
    if (raw === 'core_team' || raw === 'core-team' || raw === 'core team') return 'core_team';
    if (raw === 'client' || raw.startsWith('client')) return 'client';
    if (raw === 'talent' || raw.startsWith('talent')) return 'talent';
    if (raw === 'agency' || raw.startsWith('agency')) return 'agency';
    return raw;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isInitializing: true, // Start as true - app is initializing
            isLoading: false,
            error: null,

            // Call this after store rehydration
            setInitialized: () => set({ isInitializing: false }),

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const { user, token } = await authApi.login(credentials);
                    const normalizedUser = { ...user, role: normalizeRole(user?.role) };
                    set({ user: normalizedUser as any, token, isAuthenticated: true, isLoading: false });
                    // Also set in localStorage for apiClient to pick up immediately if needed
                    // though persist middleware handles state rehydration
                    localStorage.setItem('talentx_token', token);
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Login failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            register: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const { user, token } = await authApi.register(data);
                    const normalizedUser = { ...user, role: normalizeRole(user?.role) };
                    set({ user: normalizedUser as any, token, isAuthenticated: true, isLoading: false });
                    localStorage.setItem('talentx_token', token);
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Registration failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            logout: () => {
                localStorage.removeItem('talentx_token');
                set({ user: null, token: null, isAuthenticated: false });
            },

            checkAuth: async () => {
                const token = localStorage.getItem('talentx_token');
                if (!token) return;

                set({ isLoading: true });
                try {
                    const user = await authApi.me();
                    const normalizedUser = { ...user, role: normalizeRole(user?.role) };
                    set({ user: normalizedUser as any, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
                    localStorage.removeItem('talentx_token');
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
            //Mark initialization complete after rehydration
            onRehydrateStorage: () => (state) => {
            // This callback runs AFTER the store has loaded saved data from localStorage
            if (state) {state.setInitialized();}
    },
        }
    )
);
