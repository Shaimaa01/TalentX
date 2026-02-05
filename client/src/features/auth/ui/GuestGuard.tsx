'use client';

import { useAuthStore } from '@/features/auth/model/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect} from 'react';
import { AuthPageSkeleton } from '@/shared/components/ui/skeleton-variants';

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isInitializing } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isInitializing && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, isInitializing, router]);

    // Show skeleton only during app initialization (not during login actions)
    if (isInitializing) {
        return <AuthPageSkeleton />;
    }

    if (isAuthenticated) return null;

    return <>{children}</>;
}
