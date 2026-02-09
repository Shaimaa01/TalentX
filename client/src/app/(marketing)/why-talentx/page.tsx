'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Users, Trophy, Target } from 'lucide-react';
import TrustedBrands from '@/widgets/landing/TrustedBrands';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import FAQSection from '@/widgets/landing/FAQSection';

const valueProps = [
    {
        title: 'The Top 3% Only',
        desc: "We don't just find people; we find the elite. Our 5-stage vetting process is legendary in its rigor, ensuring only the most capable experts join our network.",
        icon: Trophy,
    },
    {
        title: 'Speed to Scale',
        desc: "Get matched with the perfect expert in 48 hours. We've optimized every friction point in the hiring process so you can move as fast as your ideas.",
        icon: Zap,
    },
    {
        title: 'Risk-Free Trial',
        desc: "Test your match for two weeks. If it's not perfect, you don't pay. It's the ultimate guarantee of quality and fit.",
        icon: ShieldCheck,
    },
];

export default function WhyTalentXPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 bg-[#020617] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e3a8a_0%,#020617_100%)] opacity-30"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl lg:text-7xl font-bold leading-tight mb-8">
                            A Higher Standard <br /> of{' '}
                            <span className="text-blue-500">Talent</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-12">
                            TalentX was built to solve the biggest bottleneck in innovation: access
                            to elite, pre-vetted specialists who can deliver results from day one.
                        </p>
                        <Link href={createPageUrl('Pricing')}>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-7 text-lg rounded-[4px] shadow-2xl transition-all">
                                Experience the Difference
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <TrustedBrands />

            {/* Values Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {valueProps.map((value, idx) => (
                            <div
                                key={idx}
                                className="p-10 border border-gray-100 rounded-3xl hover:bg-slate-50 transition-colors"
                            >
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                                    <value.icon className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 bg-[#f8faff] border-y border-gray-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop"
                                alt="Collaborative team"
                                className="relative z-10 rounded-3xl shadow-2xl grayscale"
                            />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full text-[#1a1a2e] text-xs font-bold uppercase tracking-widest mb-6">
                                Our Mission
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a1a2e] mb-8">
                                Democratic access to the world's best minds
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                We believe that location should never be a barrier to innovation. By
                                connecting the most ambitious companies with the most talented
                                individuals, we're building a future where anyone, anywhere can
                                contribute to the world's most important projects.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-3xl font-bold text-[#1a1a2e] mb-2">
                                        150+
                                    </div>
                                    <div className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                                        Countries
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-[#1a1a2e] mb-2">
                                        99.9%
                                    </div>
                                    <div className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                                        Reliability
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection category="General" />

            {/* Call to Action */}
            <section className="py-24 bg-[#020617] text-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-4xl font-extrabold mb-8">Join the elite network</h2>
                    <p className="text-xl text-gray-400 mb-12">
                        Whether you're looking to hire or be hired, the standard is the same:
                        excellence.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href={createPageUrl('Pricing')}>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-8 text-xl rounded-[4px]">
                                Start Hiring Now
                            </Button>
                        </Link>
                        <Link href={createPageUrl('ApplyTalent')}>
                            <Button
                                variant="link"
                                className="text-white font-bold text-lg hover:text-blue-400"
                            >
                                Apply to our network →
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
