'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2, Globe, ShieldCheck, Zap, Users, Star } from 'lucide-react';
import TrustedBrands from '@/widgets/landing/TrustedBrands';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import Testimonials from '@/widgets/landing/Testimonials';

const expertStats = [
    { label: 'Global Experts', value: '25k+', icon: Globe },
    { label: 'Client Satisfaction', value: '98%', icon: Star },
    { label: 'Average Experience', value: '8 Years', icon: Users },
    { label: 'Vetting Rate', value: 'Top 3%', icon: ShieldCheck },
];

export default function ExpertsPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden bg-[radial-gradient(circle_at_0%_0%,#f0f7ff_0%,#ffffff_100%)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl lg:text-6xl font-bold text-[#1a1a2e] leading-tight">
                            The World's Pre-eminent talent network
                        </h1>
                        <p className="mt-8 text-xl text-gray-600 leading-relaxed">
                            Access a curated pool of specialized engineers, designers, and strategic
                            consultants who have worked with and delivered results for the world's
                            most innovative companies.
                        </p>
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href={createPageUrl('Pricing')}>
                                <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-10 py-7 text-lg rounded-[4px] shadow-lg shadow-blue-200">
                                    Meet the Experts
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {expertStats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                                <div className="text-3xl font-bold text-[#1a1a2e] mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <TrustedBrands />

            {/* Diverse Expertise Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#1a1a2e]">
                            Specialized across every industry
                        </h2>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            From early-stage startups to Fortune 500 enterprises, our experts have
                            the domain knowledge your project deserves.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'FinTech & Banking',
                                desc: 'Security-first engineers and analysts specialized in digital assets, payments, and compliance.',
                            },
                            {
                                title: 'AI & Data Science',
                                desc: 'Researchers and developers building the next generation of generative models and predictive analytics.',
                            },
                            {
                                title: 'E-commerce & Web3',
                                desc: 'Experts in high-scale marketplaces, decentralized systems, and modern digital commerce.',
                            },
                            {
                                title: 'Healthcare & Biotech',
                                desc: 'Specialists navigating complex regulatory environments while delivering cutting-edge software solutions.',
                            },
                            {
                                title: 'SaaS & Enterprise',
                                desc: 'Cloud architects and product consultants focused on scale, reliability, and recurring revenue growth.',
                            },
                            {
                                title: 'Creative & Design',
                                desc: 'Award-winning designers creating world-class user experiences and brand identities.',
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="p-10 border border-gray-100 rounded-sm hover:bg-blue-50/30 transition-colors"
                            >
                                <h3 className="text-xl font-bold text-[#1a1a2e] mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quality Guarantee */}
            <section className="py-24 bg-[#020617] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=800&h=800&fit=crop"
                                alt="Expert professional"
                                className="rounded-2xl shadow-2xl relative z-10"
                            />
                            <div className="absolute inset-0 border-2 border-blue-500 rounded-2xl -translate-x-6 translate-y-6 opacity-30"></div>
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                                Quality Assurance
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                                Rigorous selection for unmatched reliability
                            </h2>
                            <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                                We don't just find people; we find the <i>right</i> people. Our
                                matching algorithm combines technical requirements with cultural fit
                                and timezone alignment to ensure immediate integration into your
                                workflow.
                            </p>
                            <div className="space-y-6">
                                {[
                                    {
                                        title: 'Verified Track Records',
                                        desc: 'Every expert has a proven history of success at top-tier companies.',
                                    },
                                    {
                                        title: 'Communication Mastery',
                                        desc: '100% of our network is fluent in English and trained in professional comms.',
                                    },
                                    {
                                        title: 'Timezone Alignment',
                                        desc: 'We match you with talent that works within your core business hours.',
                                    },
                                ].map((benefit, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">
                                                {benefit.title}
                                            </h4>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                {benefit.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Testimonials />

            <section className="py-24 bg-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">
                        Meet your next elite hire today
                    </h2>
                    <p className="text-xl text-gray-600 mb-12">
                        Stop settling for mediocre talent. Join the network used by industry
                        leaders.
                    </p>
                    <Link href={createPageUrl('Pricing')}>
                        <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-12 py-8 text-xl rounded-[4px] shadow-xl shadow-blue-100 transition-all hover:scale-105">
                            Browse Our Network
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
