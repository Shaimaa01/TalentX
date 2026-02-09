'use client';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-yellow flex flex-col ">
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
