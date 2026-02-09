'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { Search, UserCheck, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import TrustedBrands from '@/widgets/landing/TrustedBrands';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import FAQSection from '@/widgets/landing/FAQSection';

const steps = [
    {
        title: 'Submit Your Request',
        description:
            'Tell us about your project and the specific skills you need. Our team of experts will analyze your requirements and matching parameters.',
        icon: Search,
        delay: 0.1,
    },
    {
        title: 'Get Matched',
        description:
            "Within 48 hours, we'll introduce you to the top tier of pre-vetted talent that fits your project's technical and cultural needs.",
        icon: UserCheck,
        delay: 0.2,
    },
    {
        title: 'Trial Period',
        description:
            "Start working with your new team member on a no-risk trial. Pay only if you're 100% satisfied with their performance.",
        icon: Zap,
        delay: 0.3,
    },
    {
        title: 'Ongoing Support',
        description:
            'We handle the administrative, legal, and payment details, so you can focus on building your product with your new expert.',
        icon: ShieldCheck,
        delay: 0.4,
    },
];

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 bg-[#020617] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,#1e3a8a_0%,#020617_70%)] opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                            How TalentX Works
                        </h1>
                        <p className="mt-8 text-xl text-gray-300 leading-relaxed">
                            We've streamlined the hiring process to help you find and onboard the
                            world's top talent in record time, without the traditional hiring
                            overhead.
                        </p>
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href={createPageUrl('Pricing')}>
                                <Button className="bg-[#00c853] hover:bg-[#00b34a] text-white font-bold px-10 py-7 text-lg rounded-[4px] shadow-lg shadow-[#00c853]/20 transition-all hover:scale-105 active:scale-95">
                                    Start Hiring Now
                                </Button>
                            </Link>
                            <Link href={createPageUrl('Contact')}>
                                <Button
                                    variant="outline"
                                    className="border-white/20 text-white hover:bg-white/10 px-10 py-7 text-lg rounded-[4px] font-bold"
                                >
                                    Talk to an Expert
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <TrustedBrands />

            {/* Steps Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: step.delay }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                <div className="absolute -top-6 -left-6 text-[120px] font-bold text-gray-50 leading-none select-none group-hover:text-blue-50 transition-colors">
                                    {idx + 1}
                                </div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200">
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vetting Process Highlight */}
            <section className="py-24 bg-[#f8faff] border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a1a2e] mb-8">
                                Only the Top 3% Pass Our Vetting Process
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Our rigorous 5-step screening process ensures that you only work
                                with the most skilled, reliable, and communicative talent in the
                                world.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Comprehensive Portfolio & Experience Review',
                                    'Rigorous English Communication Test',
                                    'In-Depth Technical Assessment & Live Coding',
                                    'Personality & Soft Skills Evaluation',
                                    'Ongoing Performance Monitoring',
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#00c853] flex-shrink-0" />
                                        <span className="font-medium text-[#1a1a2e]">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-12">
                                <Link href={createPageUrl('Vetting')}>
                                    <Button
                                        variant="link"
                                        className="text-blue-600 font-bold p-0 flex items-center gap-2 hover:gap-3 transition-all"
                                    >
                                        Learn more about our vetting process →
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-blue-600 rounded-3xl rotate-3 absolute inset-0 opacity-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop"
                                alt="Team collaboration"
                                className="relative z-10 rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection category="Process" />

            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">
                        Ready to transform your project?
                    </h2>
                    <p className="text-xl text-gray-600 mb-12">
                        Join hundreds of companies that use TalentX to scale their engineering and
                        creative teams.
                    </p>
                    <Link href={createPageUrl('Pricing')}>
                        <Button className="bg-[#00c853] hover:bg-[#00b34a] text-white font-bold px-12 py-8 text-xl rounded-[4px] shadow-xl">
                            Start Working Together
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
