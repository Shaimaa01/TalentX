'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { Handshake, Globe, Zap, ShieldCheck, PieChart, Users, CheckCircle2 } from 'lucide-react';
import TrustedBrands from '@/widgets/landing/TrustedBrands';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import FAQSection from '@/widgets/landing/FAQSection';

const partnerBenefits = [
    {
        title: 'Revenue Sharing',
        desc: "Earn competitive commissions for every client or talent you refer to the TalentX network. Our transparent tracking ensures you're always rewarded.",
        icon: PieChart,
    },
    {
        title: 'Exclusive Data',
        desc: 'Get access to our proprietary talent market reports, hiring trends, and salary benchmarks to provide more value to your own network.',
        icon: Zap,
    },
    {
        title: 'Priority Access',
        desc: "Our strategic partners get first-row seats to new talent pools and beta features before they're released to the general public.",
        icon: ShieldCheck,
    },
];

export default function PartnersPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 bg-[#064e3b] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#059669_0%,#064e3b_80%)]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Handshake className="w-16 h-16 text-emerald-400 mx-auto mb-8 animate-pulse" />
                        <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-8">
                            Grow with the World's Best Talent Network
                        </h1>
                        <p className="text-xl text-emerald-100 leading-relaxed mb-12">
                            TalentX partners with VCs, accelerators, and technology platforms to
                            build a stronger ecosystem for innovation. Join us in connecting the
                            best minds with the biggest challenges.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href={createPageUrl('Contact')}>
                                <Button className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-10 py-7 text-lg rounded-[4px] shadow-2xl transition-all">
                                    Become a Strategic Partner
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <TrustedBrands />

            {/* Partnership Tiers */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#1a1a2e]">How we partner</h2>
                        <p className="mt-4 text-gray-600">
                            We offer three distinct programs designed for different ecosystem
                            players.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                type: 'Affiliate & Referral',
                                target: 'For individuals & content creators',
                                icon: Users,
                                perks: [
                                    'Competitive commissions',
                                    'Marketing resources',
                                    'Direct support',
                                ],
                            },
                            {
                                type: 'VC & Accelerator',
                                target: 'For investment firms',
                                icon: Zap,
                                perks: [
                                    'Preferential pricing',
                                    'Custom talent audits',
                                    'Portfolio support',
                                ],
                            },
                            {
                                type: 'Technology Integration',
                                target: 'For software platforms',
                                icon: Globe,
                                perks: ['API integration', 'Co-marketing rights', 'Shared roadmap'],
                            },
                        ].map((prog, idx) => (
                            <div
                                key={idx}
                                className="p-8 border border-gray-100 rounded-2xl hover:border-emerald-500/20 hover:shadow-xl transition-all h-full flex flex-col"
                            >
                                <prog.icon className="w-10 h-10 text-emerald-600 mb-6" />
                                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">
                                    {prog.type}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium mb-8">
                                    {prog.target}
                                </p>
                                <ul className="space-y-4 flex-grow mb-10">
                                    {prog.perks.map((perk, pIdx) => (
                                        <li
                                            key={pIdx}
                                            className="flex items-center gap-2 text-gray-600 text-sm font-medium"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                                <Link href={createPageUrl('Contact')}>
                                    <Button
                                        variant="outline"
                                        className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold py-6"
                                    >
                                        Apply Now
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Highlight */}
            <section className="py-24 bg-[#f0f9f6]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {partnerBenefits.map((benefit, idx) => (
                            <div key={idx} className="text-center p-8">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <benefit.icon className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1a1a2e] mb-4">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {benefit.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FAQSection category="Partner" />

            {/* CTa */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">Let's build together</h2>
                    <p className="text-xl text-gray-600 mb-12">
                        Whether you're a VC looking to support your portfolio or an integrator
                        looking for elite talent, we're ready to talk.
                    </p>
                    <Link href={createPageUrl('Contact')}>
                        <Button className="bg-[#064e3b] hover:bg-black text-white font-bold px-12 py-8 text-xl rounded-[4px] shadow-2xl">
                            Inquire about Partnership
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
