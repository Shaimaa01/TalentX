'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Zap, Building2, Lock, Users, ArrowRight } from 'lucide-react';
import TrustedBrands from '@/widgets/landing/TrustedBrands';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import FAQSection from '@/widgets/landing/FAQSection';

const enterpriseFeatures = [
    {
        title: 'Enterprise Grade Compliance',
        desc: 'Strict adherence to SOC2 Type II, ISO 27001, and GDPR. We ensure your data and intellectual property are protected by industry-leading security standards.',
        icon: Lock,
    },
    {
        title: 'Global Payroll & Tax',
        desc: 'We handle the complexity of global employment, taxes, and compliance in 150+ countries. Hire anywhere, without the administrative burden.',
        icon: Globe,
    },
    {
        title: 'Custom Vetting Workflows',
        desc: "Need specific security clearances or niche skills? We can build custom vetting pipelines to meet your organization's unique requirements.",
        icon: ShieldCheck,
    },
];

export default function EnterprisePage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 bg-[#0f172a] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,58,138,0.3)_0%,rgba(15,23,42,1)_100%)]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-400/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                                TalentX for Enterprise
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-8">
                                Scalable Talent Infrastructure for{' '}
                                <span className="text-blue-500">Global Leaders</span>
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed mb-12">
                                Unleash innovation at scale. TalentX provides Fortune 500 companies
                                and growing enterprises with the elite talent pipelines and
                                compliance infrastructure needed to lead in the age of AI.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Link href={createPageUrl('Contact')}>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-7 text-lg rounded-[4px] shadow-2xl transition-all">
                                        Request Enterprise Demo
                                    </Button>
                                </Link>
                                <Link href={createPageUrl('Contact')}>
                                    <Button
                                        variant="outline"
                                        className="border-slate-700 text-white hover:bg-white/5 px-10 py-7 text-lg rounded-[4px] font-bold"
                                    >
                                        Download Security Whitepaper
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                        <div className="hidden lg:block relative">
                            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full"></div>
                            <div className="relative border border-slate-800 bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                                <Building2 className="w-16 h-16 text-blue-500 mb-8" />
                                <div className="space-y-6">
                                    {[
                                        { label: 'Compliance Coverage', value: '150+ Countries' },
                                        { label: 'Average Setup Time', value: '< 72 Hours' },
                                        { label: 'Retention Rate', value: '96%' },
                                    ].map((stat, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center pb-4 border-b border-slate-800 last:border-0 last:pb-0"
                                        >
                                            <span className="text-slate-400 text-sm font-medium">
                                                {stat.label}
                                            </span>
                                            <span className="text-white font-bold">
                                                {stat.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <TrustedBrands />

            {/* Enterprise Benefits */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1a1a2e]">
                            Built for the modern enterprise
                        </h2>
                        <p className="mt-4 text-gray-600">
                            Enterprise-grade security, controls, and management at every step.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {enterpriseFeatures.map((feature, idx) => (
                            <div
                                key={idx}
                                className="p-12 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl transition-all"
                            >
                                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-8 shadow-sm">
                                    <feature.icon className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Strategic Value Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    {
                                        icon: Users,
                                        title: 'Team Scaling',
                                        desc: 'Build entire functional squads in weeks.',
                                    },
                                    {
                                        icon: Zap,
                                        title: 'Rapid Innovation',
                                        desc: 'Deploy AI experts to lead your R&D.',
                                    },
                                    {
                                        icon: Lock,
                                        title: 'IP Protection',
                                        desc: 'Enterprise-grade legal framing.',
                                    },
                                    {
                                        icon: Globe,
                                        title: 'Global Mobility',
                                        desc: 'Manage remote teams effortlessly.',
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="p-6 bg-slate-50 rounded-xl border border-slate-100"
                                    >
                                        <item.icon className="w-6 h-6 text-blue-600 mb-4" />
                                        <h4 className="font-bold text-[#1a1a2e] mb-2">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a1a2e] mb-8">
                                Empower your HR & Engineering Leaders
                            </h2>
                            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                                TalentX becomes an extension of your talent acquisition team. We
                                provide the analytics, reporting, and visibility your leaders need
                                to manage a high-performance global workforce.
                            </p>
                            <Link href={createPageUrl('Contact')}>
                                <Button
                                    variant="link"
                                    className="text-blue-600 font-bold p-0 flex items-center gap-2 text-lg"
                                >
                                    Book a Strategic Talent Audit <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection category="Enterprise" />

            {/* Call to Action */}
            <section className="py-24 bg-[#0f172a] text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-blue-600/5 opacity-50"></div>
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <h2 className="text-4xl font-extrabold mb-8 leading-tight">
                        Ready to institutionalize your talent pipeline?
                    </h2>
                    <p className="text-xl text-slate-400 mb-12">
                        Talk to our enterprise solution architects about building a custom talent
                        strategy for your organization.
                    </p>
                    <Link href={createPageUrl('Contact')}>
                        <Button className="bg-white text-slate-900 hover:bg-blue-50 font-bold px-12 py-8 text-xl rounded-[4px] shadow-2xl">
                            Request Strategic Consult
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
