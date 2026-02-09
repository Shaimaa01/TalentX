'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2, Globe, ShieldCheck, Zap, BarChart3, Shield } from 'lucide-react';
import TrustedBrands from '@/widgets/landing/TrustedBrands';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import HiringProcess from '@/widgets/landing/HiringProcess';
import Testimonials from '@/widgets/landing/Testimonials';
import FAQSection from '@/widgets/landing/FAQSection';

const experts = [
    {
        name: 'David Sterling',
        role: 'Fractional CFO',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
        verified: true,
        company: 'Goldman Sachs',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs_logo.svg',
    },
    {
        name: 'Rebecca Low',
        role: 'M&A Analyst',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
        verified: true,
        company: 'J.P. Morgan',
        companyLogo:
            'https://upload.wikimedia.org/wikipedia/commons/a/af/J_P_Morgan_Logo_2008_1.svg',
    },
    {
        name: 'Jonathan Wu',
        role: 'Venture Capital Consultant',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
        verified: true,
        company: 'Sequoia',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Sequoia_Capital_logo.svg',
    },
    {
        name: 'Isabella Martinez',
        role: 'Wealth Management Expert',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
        verified: true,
        company: 'Morgan Stanley',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Morgan_Stanley_logo.svg',
    },
    {
        name: 'Samuel Green',
        role: 'Risk Management Analyst',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
        verified: true,
        company: 'KPMG',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/KPMG-logo.svg',
    },
    {
        name: 'Dr. Linda Gray',
        role: 'Quantitative Analyst',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop',
        verified: true,
        company: 'BlackRock',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/BlackRock_logo.svg',
    },
];

const skills = [
    { name: 'Financial Modeling', category: 'Core' },
    { name: 'Investment Banking', category: 'Specialization' },
    { name: 'Valuation', category: 'Core' },
    { name: 'M&A', category: 'Strategic' },
    { name: 'Risk Assessment', category: 'Analysis' },
    { name: 'Treasury Management', category: 'Operational' },
    { name: 'Audit & Compliance', category: 'Legal' },
    { name: 'Tax Strategy', category: 'Operational' },
    { name: 'FinTech Architecture', category: 'Technology' },
    { name: 'Crypto Assets', category: 'Emerging' },
];

export default function FinanceExpertsPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-10 pb-32 overflow-hidden">
                <div className="absolute top-10 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
                    <Globe className="w-full h-full text-[#1a1a2e]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="max-w-xl">
                            <h1 className="text-4xl lg:text-6xl font-bold text-[#1a1a2e] leading-[1.1]">
                                Hire the{' '}
                                <span className="relative inline-block">
                                    <span className="relative z-10">Top 10%</span>
                                    <span className="absolute bottom-1 left-0 w-full h-[2px] bg-black/80"></span>
                                </span>{' '}
                                of Finance Experts
                            </h1>
                            <p className="mt-8 text-lg text-gray-600 leading-relaxed">
                                Scale your business with elite financial leadership. From fractional
                                CFOs to investment banking analysts, our network provides the
                                high-level expertise needed for complex financial operations.
                            </p>

                            <div className="mt-12 space-y-6">
                                <Link href={createPageUrl('Pricing')}>
                                    <Button className="bg-[#00c853] hover:bg-[#00b34a] text-white font-bold px-8 py-6 text-lg rounded-[4px] shadow-lg shadow-[#00c853]/20 transition-all hover:scale-105 active:scale-95">
                                        Hire a Top Finance Expert
                                    </Button>
                                </Link>
                                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 px-1">
                                    No-Risk Trial, Pay Only If Satisfied.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {experts.map((exp, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white border border-gray-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group relative"
                                >
                                    <div className="relative z-10">
                                        <div className="aspect-[4/5] relative overflow-hidden">
                                            <img
                                                src={exp.image}
                                                alt={exp.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-3 left-3 bg-white p-1.5 shadow-sm rounded-sm">
                                                <div className="w-2 h-2 bg-[#204ecf] rotate-45" />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/40 backdrop-blur-[1px]">
                                            <h3 className="text-sm font-bold text-[#204ecf] truncate">
                                                {exp.name}
                                            </h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <CheckCircle2 className="w-3 h-3 text-[#00c853] fill-current" />
                                                <span className="text-[10px] font-bold text-gray-900">
                                                    Verified Expert
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1 font-medium">
                                                {exp.role}
                                            </p>

                                            <div className="mt-4 pt-4 border-t border-gray-50">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                    Previously at
                                                </p>
                                                <div className="mt-2 h-6 flex items-center">
                                                    <img
                                                        src={exp.companyLogo}
                                                        alt={exp.company}
                                                        className="h-full w-auto opacity-70 grayscale hover:grayscale-0 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <TrustedBrands />

            {/* Finance Skills Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#1a1a2e]">
                            Core Financial Competencies
                        </h2>
                        <p className="mt-4 text-gray-600">
                            Our experts bring experience from the world's leading financial
                            institutions.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {skills.map((skill, idx) => (
                            <div
                                key={idx}
                                className="p-6 border border-gray-100 rounded-sm hover:shadow-lg transition-all text-center group cursor-pointer"
                            >
                                <BarChart3 className="w-8 h-8 text-emerald-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-[#1a1a2e] block">{skill.name}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">
                                    {skill.category}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <HiringProcess />

            {/* Benefits Section */}
            <section className="py-24 bg-[#f8faff]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#1a1a2e]">
                            Why Trust TalentX Finance Experts
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: ShieldCheck,
                                title: 'Elite Pedigree',
                                desc: 'Our financial experts come from Ivy League institutions and bulge-bracket investment banks.',
                            },
                            {
                                icon: Zap,
                                title: 'Immediate Strategic Impact',
                                desc: 'Hire fractional leadership that can restructure your finances or lead a fundraise in record time.',
                            },
                            {
                                icon: Shield,
                                title: 'Secure & Compliant',
                                desc: 'All our experts are vetted for compliance and handle sensitive financial data with total confidentiality.',
                            },
                        ].map((benefit, idx) => (
                            <div key={idx} className="text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <benefit.icon className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1a1a2e] mb-4">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Testimonials />

            <FAQSection category="Finance" />

            <section className="py-16 border-t border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 px-4">
                    <span className="text-lg text-gray-900 font-medium">
                        Strategic finance talent is in high demand.
                    </span>
                    <Link href={createPageUrl('Pricing')}>
                        <Button className="bg-[#00d084] hover:bg-[#00ba76] text-white font-bold px-10 py-6 rounded-[4px] text-lg transition-all hover:scale-105">
                            Start Hiring
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
