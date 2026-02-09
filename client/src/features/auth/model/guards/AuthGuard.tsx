'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../auth.store';
import { DashboardSkeleton } from '@/shared/components/ui/skeleton-variants';

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const init = async () => {
            await checkAuth();
            setChecked(true);
        };
        init();
    }, [checkAuth]);

    useEffect(() => {
        if (checked && !isAuthenticated && !isLoading) {
            router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        }
    }, [isAuthenticated, isLoading, router, pathname, checked]);

    if (isLoading || !checked) {
        return <DashboardSkeleton />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};
