'use client';

import { useAuthStore } from "@/features/auth/model/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthPageSkeleton } from "@/shared/components/ui/skeleton-variants";
import { createPageUrl } from "@/shared/lib/utils";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated,  isInitializing} = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        // Short timeout to allow store rehydration if using persist
        const timer = setTimeout(() => {
           if (!isInitializing && !isAuthenticated) {
            router.push(createPageUrl('Login'));
        }
        }, 100);
        return () => clearTimeout(timer);
    }, [isAuthenticated, isInitializing, router]);

      if (isInitializing) {
        return <AuthPageSkeleton />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
