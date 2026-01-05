'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface GuestGuardProps {
    children: React.ReactNode;
}

const GuestGuard = ({ children }: GuestGuardProps) => {
    const router = useRouter();
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    if (!mounted || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default GuestGuard;
