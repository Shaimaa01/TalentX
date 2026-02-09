'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Code, UserCheck, MessageSquare, CheckCircle2 } from 'lucide-react';
import TrustedBrands from '@/widgets/landing/TrustedBrands';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';

const vettingSteps = [
    {
        title: 'Portfolio & Application Review',
        desc: "We manually review every applicant's professional history, public contributions (GitHub/Portfolio), and references. Only the top 10% proceed.",
        icon: Search,
        details: ['Work history validation', 'Portfolio quality assessment', 'Reference checking'],
    },
    {
        title: 'English Communication Test',
        desc: 'Talent must demonstrate mastery of spoken and written English. We look for clarity, professionalism, and cultural compatibility.',
        icon: MessageSquare,
        details: [
            'Verbal fluency interview',
            'Written communication test',
            'Cultural fit evaluation',
        ],
    },
    {
        title: 'Technical Assessment',
        desc: 'A field-specific, rigorous examination. For developers, this includes algorithmic challenges and live coding sessions.',
        icon: Code,
        details: ['Language-specific tests', 'Live coding interviews', 'System design exercise'],
    },
    {
        title: 'Subject Matter Expert Review',
        desc: 'Final technical round with a senior expert in their specific field. Candidates are pushed to their limits to prove deep expertise.',
        icon: UserCheck,
        details: ['Deep-dive technical Q&A', 'Scenario-based solving', 'Code quality review'],
    },
    {
        title: 'The TalentX Standard',
        desc: 'The final seal of approval. Experts are onboarded and monitored for their initial projects to ensure high-performance delivery.',
        icon: ShieldCheck,
        details: ['Onboarding orientation', 'Probationary milestone', 'Ongoing QA reviews'],
    },
];

export default function VettingPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 bg-[#f8faff] overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 clip-path-polygon-[100%_0,100%_100%,0_100%]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
                                The TalentX Standard
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold text-[#1a1a2e] leading-tight">
                                How we find the world's{' '}
                                <span className="text-blue-600">Top 3%</span>
                            </h1>
                            <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Most talent networks just check boxes. We build deep profiles. Our
                                vetting process is designed to find individuals who combine
                                world-class technical skills with exceptional professionalism.
                            </p>
                            <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                                <Link href={createPageUrl('Pricing')}>
                                    <Button className="bg-[#1a1a2e] hover:bg-black text-white font-bold px-10 py-7 text-lg rounded-[4px] transition-all">
                                        Hire Vetted Talent
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-3xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=800&fit=crop"
                                alt="Professionals in meeting"
                                className="relative z-10 rounded-2xl shadow-2xl scale-95 hover:scale-100 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <TrustedBrands />

            {/* Vetting Steps Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold text-[#1a1a2e]">
                            Our Multi-Stage Screening Process
                        </h2>
                        <p className="mt-4 text-gray-600">
                            Every candidate is evaluated by multiple people through rigorous
                            assessments.
                        </p>
                    </div>

                    <div className="space-y-16">
                        {vettingSteps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`flex flex-col lg:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                <div className="lg:w-1/2">
                                    <div className="w-16 h-16 bg-[#1a1a2e] text-white rounded-2xl flex items-center justify-center mb-8 text-2xl font-bold shadow-xl">
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-[#1a1a2e] mb-6">
                                        {step.title}
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                        {step.desc}
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {step.details.map((detail, dIdx) => (
                                            <div
                                                key={dIdx}
                                                className="flex items-center gap-2 text-sm font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-gray-100"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                {detail}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:w-1/2 h-[300px] bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
                                    {/* Visual representation placeholder */}
                                    <div className="text-center text-gray-400">
                                        <step.icon className="w-24 h-24 mx-auto mb-4 opacity-10" />
                                        <span className="text-sm font-medium uppercase tracking-widest opacity-30">
                                            Phase {idx + 1} Assessment
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Satisfaction Guarantee */}
            <section className="py-24 bg-[#0a0a0a] text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold mb-8">The No-Risk Trial Guarantee</h2>
                    <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                        We are so confident in our vetting process that we offer a no-risk trial
                        period. Hire a TalentX expert, and if you're not completely satisfied with
                        their work during the first two weeks, you don't pay. We'll even help you
                        find a replacement as quickly as possible.
                    </p>
                    <Link href={createPageUrl('Pricing')}>
                        <Button className="bg-[#00c853] hover:bg-[#00b34a] text-white font-bold px-12 py-8 text-xl rounded-[4px] shadow-lg shadow-[#00c853]/20">
                            Start Your Trial
                        </Button>
                    </Link>
                </div>
            </section>

            <section className="py-24 bg-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                        Want to join as an expert?
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Prepare for the toughest interview of your career.
                    </p>
                    <Link href={createPageUrl('ApplyTalent')}>
                        <Button
                            variant="outline"
                            className="border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white px-8 py-4 font-bold transition-all"
                        >
                            Apply to our Network
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
