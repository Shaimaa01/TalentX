'use client';

import { AuthGuard } from '@/features/auth/model/guards/AuthGuard';
import SocketProvider from '@/providers/SocketProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <SocketProvider>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <main className="flex-1">{children}</main>
                </div>
            </SocketProvider>
        </AuthGuard>
    );
}
