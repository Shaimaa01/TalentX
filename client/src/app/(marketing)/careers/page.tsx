'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Zap, Users, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';

const openRoles = [
    { title: 'Senior Product Designer', team: 'Design', location: 'Global / Remote' },
    { title: 'Engineering Manager (AI/ML)', team: 'Engineering', location: 'Global / Remote' },
    { title: 'Talent Acquisition Partner', team: 'Operations', location: 'London / Hybrid' },
    { title: 'Growth Marketing Manager', team: 'Marketing', location: 'New York / Hybrid' },
];

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 bg-[#020617] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,#1e3a8a_0%,#020617_70%)] opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl lg:text-7xl font-bold leading-tight mb-8">
                            Help us build the <br />{' '}
                            <span className="text-blue-500">Future of Work</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-12">
                            We're a remote-first, mission-driven team dedicated to connecting the
                            world's best talent with its biggest challenges. Join us.
                        </p>
                        <Link href="#open-roles">
                            <Button className="bg-[#00c853] hover:bg-[#00b34a] text-white font-bold px-10 py-7 text-lg rounded-[4px] shadow-2xl transition-all">
                                View Open Roles
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Culture Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
                                Life at TalentX
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a1a2e] mb-8">
                                Work from anywhere, grow with everyone
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                We're not just a platform; we're a community of innovators who
                                believe in autonomy, transparency, and the power of distributed
                                teams.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-8">
                                {[
                                    {
                                        icon: Globe,
                                        title: 'Remote-First',
                                        desc: 'Work from wherever you feel most inspired.',
                                    },
                                    {
                                        icon: Zap,
                                        title: 'Hyper-Growth',
                                        desc: 'Grow as fast as we do in a high-impact role.',
                                    },
                                    {
                                        icon: Heart,
                                        title: 'Wellness First',
                                        desc: 'Comprehensive health and mental wellness benefits.',
                                    },
                                    {
                                        icon: Star,
                                        title: 'Ownership',
                                        desc: 'Equity options for every full-time member.',
                                    },
                                ].map((benefit, i) => (
                                    <div key={i} className="space-y-3">
                                        <benefit.icon className="w-6 h-6 text-blue-600" />
                                        <h4 className="font-bold text-[#1a1a2e]">
                                            {benefit.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {benefit.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=1000&fit=crop"
                                alt="Team laughing"
                                className="rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Roles */}
            <section id="open-roles" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#1a1a2e]">Open Opportunities</h2>
                        <p className="mt-4 text-gray-600">
                            Can't find a fit? Email us at careers@talentx.ai
                        </p>
                    </div>

                    <div className="space-y-4 max-w-4xl mx-auto">
                        {openRoles.map((role, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-6 lg:p-8 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-xl transition-all group cursor-pointer"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-[#1a1a2e] mb-1 group-hover:text-blue-600 transition-colors">
                                        {role.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                                        <span>{role.team}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>{role.location}</span>
                                    </div>
                                </div>
                                <div className="mt-6 sm:mt-0">
                                    <Button
                                        variant="outline"
                                        className="border-gray-200 text-[#1a1a2e] hover:bg-gray-50 font-bold px-6 py-4 rounded-sm flex items-center gap-2"
                                    >
                                        Apply Now <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
