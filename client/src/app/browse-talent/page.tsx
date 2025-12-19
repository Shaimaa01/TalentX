'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Search, Filter, Star, MapPin, Briefcase, DollarSign, CheckCircle, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { talentXApi } from '@/api/talentXApi';
import { Talent } from '@/types';
import Link from 'next/link';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import AIMatchingModal from '@/components/AIMatchingModal';

import { Pagination } from '@/components/ui/Pagination';
import { Suspense } from 'react';

function BrowseTalentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [talents, setTalents] = useState<(Talent & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchTalents = async () => {
            setLoading(true);
            try {
                const result = await talentXApi.entities.Talent.list();
                let filtered = result as (Talent & { id: string })[];

                if (selectedCategory !== 'all') {
                    filtered = filtered.filter(t => t.category === selectedCategory);
                }

                if (searchTerm) {
                    const lowerTerm = searchTerm.toLowerCase();
                    filtered = filtered.filter(t =>
                        t.full_name.toLowerCase().includes(lowerTerm) ||
                        t.title.toLowerCase().includes(lowerTerm) ||
                        t.skills?.some(s => s.toLowerCase().includes(lowerTerm))
                    );
                }

                setTalents(filtered);
                setCurrentPage(1); // Reset to first page on filter change
            } catch (error) {
                console.error("Failed to fetch talents:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTalents();
    }, [selectedCategory, searchTerm]);

    // Calculate pagination
    const totalPages = Math.ceil(talents.length / itemsPerPage);
    const paginatedTalents = talents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const categories = [
        { id: 'all', label: 'All Talent' },
        { id: 'developer', label: 'Developers' },
        { id: 'designer', label: 'Designers' },
        { id: 'marketing', label: 'Marketing' },
        { id: 'finance', label: 'Finance' },
        { id: 'product_manager', label: 'Product Managers' },
        { id: 'project_manager', label: 'Project Managers' }
    ];

    return (
        <div className="min-h-screen bg-[#f5f7fa] pt-24 pb-12">
            <AIMatchingModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold text-[#1a1a2e] mb-4">Browse Top Talent</h1>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            Connect with the top 3% of freelance talent. Pre-vetted, expert professionals ready to join your team.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAIModalOpen(true)}
                        className="bg-[#00c853] hover:bg-[#009624] text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center gap-2 animate-pulse"
                    >
                        <Sparkles className="w-5 h-5" />
                        AI Matcher
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-72 flex-shrink-0 space-y-8">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by name or skill..."
                                className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary h-12 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Categories */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Categories
                            </h3>
                            <div className="space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${selectedCategory === cat.id
                                            ? 'bg-primary text-white font-medium shadow-md shadow-primary/20'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl h-96 animate-pulse border border-gray-100" />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {paginatedTalents.map((talent, index) => (
                                        <motion.div
                                            key={talent.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link href={createPageUrl(`talent-profile?id=${talent.id}`)}>
                                                <Card className="h-full hover:shadow-xl transition-all duration-300 border-gray-100 group cursor-pointer overflow-hidden flex flex-col">
                                                    <div className="relative h-24 bg-gradient-to-r from-[#1a1a2e] to-[#204ecf]">
                                                        <div className="absolute -bottom-10 left-6">
                                                            <div className="relative">
                                                                <img
                                                                    src={talent.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.full_name)}&background=random`}
                                                                    alt={talent.full_name}
                                                                    className="w-20 h-20 rounded-xl border-4 border-white shadow-md object-cover"
                                                                />
                                                                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <CardContent className="pt-12 pb-4 px-6 flex-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h3 className="font-bold text-lg text-[#1a1a2e] group-hover:text-primary transition-colors">
                                                                    {talent.full_name}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 font-medium">{talent.title}</p>
                                                            </div>
                                                            {talent.rating && (
                                                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                    <span className="text-xs font-bold text-yellow-700">{talent.rating}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 mb-6">
                                                            {talent.skills?.slice(0, 3).map((skill) => (
                                                                <span key={skill} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-md font-medium border border-gray-100">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                            {talent.skills && talent.skills.length > 3 && (
                                                                <span className="px-2.5 py-1 bg-gray-50 text-gray-400 text-xs rounded-md font-medium border border-gray-100">
                                                                    +{talent.skills.length - 3}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2.5 text-sm text-gray-600 border-t border-gray-50 pt-4">
                                                            <div className="flex items-center gap-3">
                                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                                <span>{talent.experience_years}+ years exp.</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                                <span>{talent.location || 'Remote'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <DollarSign className="w-4 h-4 text-gray-400" />
                                                                <span className="font-semibold text-[#1a1a2e]">${talent.hourly_rate}/hr</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>

                                                    <CardFooter className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center mt-auto">
                                                        <span className="text-xs font-medium text-green-600 flex items-center gap-1.5">
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            Available Now
                                                        </span>
                                                        <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                                            View Profile <ChevronRight className="w-3.5 h-3.5" />
                                                        </span>
                                                    </CardFooter>
                                                </Card>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}

                        {!loading && talents.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No talent found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search terms</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BrowseTalent() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f5f7fa] pt-24 pb-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <BrowseTalentContent />
        </Suspense>
    );
}

