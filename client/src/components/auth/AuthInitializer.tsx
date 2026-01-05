'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { talentXApi } from '@/api/talentXApi';
import { setUser, loginFailure, loginStart, stopLoading } from '@/store/slices/authSlice';

const AuthInitializer = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('talentx_token');
            const storedUser = localStorage.getItem('talentx_user');

            if (!token) {
                dispatch(stopLoading());
                return;
            }

            // Optimistically set user if available
            if (storedUser) {
                dispatch(setUser(JSON.parse(storedUser)));
            }

            try {
                // If we have a token (safe to check)
                // We fetch the user to validate session
                const user = await talentXApi.auth.me();
                if (user) {
                    dispatch(setUser(user));
                }
            } catch (error) {
                console.error('Failed to restore session:', error);
                // Clear everything if session is invalid
                dispatch(loginFailure('Session expired'));
                localStorage.removeItem('talentx_token');
                localStorage.removeItem('talentx_user');
            } finally {
                dispatch(stopLoading());
            }
        };

        initAuth();
    }, [dispatch]);

    return null;
};

export default AuthInitializer;
