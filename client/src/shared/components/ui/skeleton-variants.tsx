import { Skeleton } from "./skeleton"

/**
 * Specialized skeleton components for different loading states
 * Inspired by wireframe patterns for better UX
 */

// Auth Loading - Login/Register pages with hero image
export function AuthPageSkeleton() {
    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Hero Image (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2  relative overflow-hidden">
                {/* Hero Content Skeleton */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
                    <Skeleton className="h-12 w-3/4 mx-auto mb-6 " />
                    <Skeleton className="h-6 w-full max-w-md mx-auto " />
                    <Skeleton className="h-6 w-5/6 max-w-md mx-auto mt-3 " />
                </div>
                
                {/* Background Image Placeholder */}
                <div className="absolute inset-0 bg-gray-200/70" />
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 ">
                <div className="w-full max-w-md space-y-6 bg-gray-200/70 p-4 rounded-2xl">
                    {/* Back Link */}
                    <Skeleton className="h-4 w-32" />

                    {/* Form Header */}
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-56" />
                    </div>

                    {/* Form Card */}
                    <div className="bg-gray-200/70 rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
                        {/* Form Fields */}
                        {[1, 2].map(i => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    {i === 2 && <Skeleton className="h-4 w-32" />}
                                </div>
                                <Skeleton className="h-12 w-full rounded-xl" />
                            </div>
                        ))}

                        {/* Submit Button */}
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>

                    {/* Footer Link */}
                    <div className="text-center">
                        <Skeleton className="h-4 w-56 mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// Registration Multi-Step Form
export function RegisterFormSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center py-12 px-4">
                {/* Progress Steps */}
                <div className="w-full max-w-3xl mb-12">
                    <div className="flex justify-between items-center">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <Skeleton className="h-8 w-48 mx-auto mb-6" />
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-12 w-full rounded-xl" />
                            </div>
                        ))}
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// Dashboard Grid Layout
export function DashboardSkeleton() {
    return (
         <div className="min-h-screen bg-gray-50 flex relative">
            {/* Sidebar Skeleton */}
            <aside className="w-64 bg-gray-200/70 border-r border-gray-200 absolute  inset-y-0 left-0 z-50 hidden lg:block">
                <div className="p-6 space-y-8">
                    <Skeleton className="h-8 w-32" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-10 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content Skeleton */}
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col pt-8">
                <div className="p-4 sm:p-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-10 w-32 rounded-xl" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-200/70 p-6 rounded-2xl border border-gray-200 space-y-4">
                                <Skeleton className="h-10 w-32" />
                            </div>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-200/70 rounded-2xl border border-gray-200 p-6 space-y-4">
                                <div className="flex justify-between">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <div className="pt-4 border-gray-300 border-t flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

// Profile Page Layout
export function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <div className="flex items-start gap-6">
                        <Skeleton className="h-24 w-24 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-32" />
                            <div className="flex gap-4">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-24 rounded-xl" />
                    </div>
                </div>

                {/* Bio Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Grid Content */}
                <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// List/Feed Layout
export function ListSkeleton({ items = 5 }: { items?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Card Grid Layout
export function CardGridSkeleton({ columns = 3, items = 6 }: { columns?: number; items?: number }) {
    const gridCols = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

    return (
        <div className={`grid ${gridCols} gap-6`}>
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <div className="flex justify-between items-center pt-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-8 w-24 rounded-xl" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Table Layout
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-4 w-20" />
                    ))}
                </div>
            </div>
            {/* Table Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="border-b border-gray-100 p-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-8 w-20 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// Form Layout
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
    return (
        <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            
            <div className="space-y-4">
                {Array.from({ length: fields }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
        </div>
    )
}
