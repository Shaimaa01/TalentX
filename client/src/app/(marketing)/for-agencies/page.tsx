'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { Building2, Globe, ShieldCheck, Zap, Laptop, ArrowRight } from 'lucide-react';
import TrustedBrands from '@/widgets/landing/TrustedBrands';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import FAQSection from '@/widgets/landing/FAQSection';

const agencyBenefits = [
    {
        title: 'Scale Your Bandwidth',
        desc: "Don't turn down projects because your team is at capacity. Use TalentX to find specialized specialists that integrate into your existing workflow.",
        icon: Zap,
    },
    {
        title: 'Global Talent Pool',
        desc: 'Access the same elite 3% pool used by industry giants. From senior architects to niche designers, we have the talent your clients demand.',
        icon: Globe,
    },
    {
        title: 'Seamless Integration',
        desc: 'Our experts are trained to work within agency environments, adapting to your tools, timezones, and communication styles immediately.',
        icon: Laptop,
    },
];

export default function ForAgenciesPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 bg-[#1e1b4b] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_0%,#312e81_100%)] opacity-90"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <Building2 className="w-full h-full scale-150 rotate-12" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-indigo-200 text-xs font-bold uppercase tracking-widest mb-6">
                                Agency Partnership Program
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-8">
                                The Talent Network that{' '}
                                <span className="text-indigo-400">Empowers</span> Agencies
                            </h1>
                            <p className="text-xl text-indigo-100 leading-relaxed max-w-2xl mb-12">
                                Scale your agency's capabilities without the overhead of full-time
                                hires. TalentX provides the elite technical and creative talent you
                                need to deliver world-class projects for your clients.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Link href={createPageUrl('ApplyAgency')}>
                                    <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-10 py-7 text-lg rounded-[4px] shadow-2xl transition-all">
                                        Join as a Partner Agency
                                    </Button>
                                </Link>
                                <Link href={createPageUrl('Contact')}>
                                    <Button
                                        variant="outline"
                                        className="border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg rounded-[4px] font-bold"
                                    >
                                        Speak with our Team
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <TrustedBrands />

            {/* Why TalentX for Agencies */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {agencyBenefits.map((benefit, idx) => (
                            <div
                                key={idx}
                                className="p-10 bg-indigo-50/50 rounded-2xl hover:bg-indigo-50 transition-colors group"
                            >
                                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                    <benefit.icon className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Program Tiers/Features */}
            <section className="py-24 bg-[#fafaff] border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1a1a2e]">
                            Tailored for Agency Growth
                        </h2>
                        <p className="mt-4 text-gray-600">
                            Flexible engagement models designed to fit your specific agency needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-12 bg-white rounded-sm border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                            <h3 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                Staff Augmentation
                            </h3>
                            <p className="text-gray-600 mb-8 flex-grow">
                                Add individual experts to your existing team. They integrate into
                                your tools (Slack, Jira, etc.) and report directly to your PMs.
                            </p>
                            <ul className="space-y-4 mb-10">
                                {[
                                    'Direct Integration',
                                    'Daily Sync-ups',
                                    'White-label Options',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                        <span className="font-bold text-[#1a1a2e]">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href={createPageUrl('Contact')}>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 font-bold">
                                    Inquire Now
                                </Button>
                            </Link>
                        </div>
                        <div className="p-12 bg-white rounded-sm border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                            <h3 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                Full Product Teams
                            </h3>
                            <p className="text-gray-600 mb-8 flex-grow">
                                Deploy an entire squad comprising PMs, designers, and engineers to
                                handle end-to-end deliverables for your clients.
                            </p>
                            <ul className="space-y-4 mb-10">
                                {[
                                    'Cohesive Squads',
                                    'Dedicated Management',
                                    'Output-based Billing',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                        <span className="font-bold text-[#1a1a2e]">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href={createPageUrl('Contact')}>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 font-bold">
                                    Request a Quote
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection category="Agency" />

            {/* Bottom CTA */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold text-[#1a1a2e] mb-8">
                        Ready to grow your agency?
                    </h2>
                    <p className="text-xl text-gray-600 mb-12">
                        Join our network of partner agencies and start delivering more value to your
                        clients today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href={createPageUrl('ApplyAgency')}>
                            <Button className="bg-[#1e1b4b] hover:bg-black text-white font-bold px-12 py-8 text-xl rounded-[4px] shadow-2xl">
                                Apply to Partner Program
                            </Button>
                        </Link>
                        <Link href={createPageUrl('Contact')}>
                            <Button
                                variant="link"
                                className="text-indigo-600 font-bold flex items-center gap-2"
                            >
                                Read Case Studies <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
