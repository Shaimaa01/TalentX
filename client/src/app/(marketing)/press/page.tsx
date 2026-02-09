'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { Newspaper, Download, ArrowRight, Globe, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';

export default function PressPage() {
    return (
        <main className="min-h-screen bg-white">
            <section className="relative pt-24 pb-32 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h1 className="text-4xl lg:text-6xl font-bold text-[#1a1a2e] leading-tight mb-8">
                            TalentX News & Media
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12">
                            The latest updates, announcements, and insights from the frontlines of
                            the global talent revolution.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 item-start">
                        <div>
                            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-12">
                                Latest Press Releases
                            </h2>
                            <div className="space-y-12">
                                {[
                                    {
                                        date: 'Oct 24, 2023',
                                        title: 'TalentX raises $50M Series B to scale AI-driven vetting infrastructure',
                                        source: 'TechCrunch',
                                    },
                                    {
                                        date: 'Sep 12, 2023',
                                        title: 'Former Google Engineering VP joins TalentX as Chief Talent Officer',
                                        source: 'VentureBeat',
                                    },
                                    {
                                        date: 'Aug 05, 2023',
                                        title: 'TalentX expansion into LATAM creates 5,000+ new opportunities for local experts',
                                        source: 'Bloomberg',
                                    },
                                ].map((news, idx) => (
                                    <div key={idx} className="group cursor-pointer">
                                        <div className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">
                                            {news.date} • {news.source}
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#1a1a2e] group-hover:text-blue-600 transition-colors mb-4">
                                            {news.title}
                                        </h3>
                                        <Button
                                            variant="link"
                                            className="px-0 font-bold text-gray-400 group-hover:text-blue-600 flex items-center gap-2"
                                        >
                                            Read More <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:sticky lg:top-24">
                            <div className="bg-[#1a1a2e] text-white rounded-2xl p-10 shadow-2xl">
                                <h2 className="text-2xl font-bold mb-8">Media Assets</h2>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Download our official logo, leadership headshots, and company
                                    fact sheet for media use.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        'Brand Identity Kit (ZIP, 12MB)',
                                        'Executive Leadership Photos',
                                        'TalentX Fact Sheet 2024',
                                        'Product Screenshots',
                                    ].map((asset, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                                        >
                                            <span className="font-bold text-sm">{asset}</span>
                                            <Download className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 pt-8 border-t border-white/10">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                        Press Inquiries
                                    </h3>
                                    <div className="text-lg font-bold">press@talentx.ai</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-50 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">
                        Our Impact by the Numbers
                    </h2>
                    <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">25k+</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Global Experts
                            </div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Countries
                            </div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Satisfaction
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
