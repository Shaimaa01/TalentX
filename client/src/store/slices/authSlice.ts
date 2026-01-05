import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            if (typeof window !== 'undefined') {
                localStorage.setItem('talentx_token', action.payload.token);
            }
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('talentx_token');
            }
        },
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        stopLoading: (state) => {
            state.loading = false;
        }
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser, stopLoading } = authSlice.actions;
export default authSlice.reducer;
