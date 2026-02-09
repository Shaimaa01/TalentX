'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Zap, Users, BarChart } from 'lucide-react';
import TrustedBrands from '@/widgets/landing/TrustedBrands';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';

const caseStudies = [
    {
        title: 'Scaling AI Infrastructure for a FinTech Unicorn',
        client: 'Lendify',
        category: 'AI & ML',
        desc: "How TalentX deployed a squad of 12 senior AI engineers to rebuild Lendify's credit scoring engine in record time.",
        image: 'https://images.unsplash.com/photo-1551288049-bbda4833effb?w=800&h=500&fit=crop',
        slug: 'lendify-ai-scaling',
    },
    {
        title: 'Modernizing Legacy Banking Systems',
        client: 'Global Bank Corp',
        category: 'Enterprise',
        desc: 'A strategic team of 25 developers migrated 40 years of COBOL logic to a modern cloud-native architecture.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
        slug: 'global-bank-modernization',
    },
    {
        title: 'E-commerce Peak Performance during Black Friday',
        client: 'ShopGlobal',
        category: 'Staff Augmentation',
        desc: 'Deploying senior DevOps and SRE experts to ensure 99.99% uptime during the largest traffic event in company history.',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop',
        slug: 'shopglobal-uptime',
    },
];

export default function CaseStudiesPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 bg-[#f8f9fc] overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl lg:text-6xl font-bold text-[#1a1a2e] leading-tight">
                            Success Stories from the <span className="text-blue-600">TalentX</span>{' '}
                            Network
                        </h1>
                        <p className="mt-8 text-xl text-gray-600 leading-relaxed">
                            Discover how leading organizations use TalentX to scale their teams,
                            accelerate innovation, and deliver mission-critical projects.
                        </p>
                    </motion.div>
                </div>
            </section>

            <TrustedBrands />

            {/* Featured Case Studies Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {caseStudies.map((study, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-video overflow-hidden rounded-2xl mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                                    <img
                                        src={study.image}
                                        alt={study.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                                            {study.category}
                                        </span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            {study.client}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1a1a2e] group-hover:text-blue-600 transition-colors">
                                        {study.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">{study.desc}</p>
                                    <Link href={createPageUrl(`CaseStudies/${study.slug}`)}>
                                        <Button
                                            variant="link"
                                            className="px-0 font-bold text-[#1a1a2e] flex items-center gap-2 group-hover:gap-3 transition-all"
                                        >
                                            Read Case Study <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-24 bg-[#1a1a2e] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: 'Successful Hires', value: '2.5k+', icon: Users },
                            { label: 'Hours Saved/Hiring', value: '240+', icon: Zap },
                            { label: 'Countries Served', value: '65+', icon: Globe },
                            { label: 'Project Success Rate', value: '99.2%', icon: BarChart },
                        ].map((stat, i) => (
                            <div key={i}>
                                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-6" />
                                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">
                        Ready to write your own success story?
                    </h2>
                    <p className="text-xl text-gray-600 mb-12">
                        Talk to our experts about your next project and find out how TalentX can
                        help you scale.
                    </p>
                    <Link href={createPageUrl('Contact')}>
                        <Button className="bg-[#2563eb] hover:bg-black text-white font-bold px-12 py-8 text-xl rounded-[4px] shadow-2xl">
                            Let's Get Started
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
