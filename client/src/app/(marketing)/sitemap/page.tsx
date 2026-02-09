'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import { Map, ArrowRight } from 'lucide-react';

const sitemapData = [
    {
        title: 'Hire Talent',
        links: [
            { label: 'AI & ML Engineers', url: 'AiMlEngineers' },
            { label: 'Developers', url: 'Developers' },
            { label: 'Designers', url: 'Designers' },
            { label: 'Product Managers', url: 'ProductManagers' },
            { label: 'Project Managers', url: 'ProjectManagers' },
            { label: 'Marketing Experts', url: 'MarketingExperts' },
            { label: 'Finance Experts', url: 'FinanceExperts' },
        ],
    },
    {
        title: 'Hire Team',
        links: [
            { label: 'How it works', url: 'HowItWorks' },
            { label: 'Our experts', url: 'Experts' },
            { label: 'Talent vetting', url: 'Vetting' },
            { label: 'Join as talent', url: 'ApplyTalent' },
        ],
    },
    {
        title: 'Hire Agency',
        links: [
            { label: 'For agencies', url: 'ForAgencies' },
            { label: 'Partner with us', url: 'Partners' },
            { label: 'Enterprise solutions', url: 'Enterprise' },
            { label: 'Case studies', url: 'CaseStudies' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'Why TalentX', url: 'WhyTalentx' },
            { label: 'About Us', url: 'About' },
            { label: 'Contact Us', url: 'Contact' },
            { label: 'Press', url: 'Press' },
            { label: 'Careers', url: 'Careers' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', url: 'Privacy' },
            { label: 'Terms of Service', url: 'Terms' },
            { label: 'Accessibility', url: 'Accessibility' },
        ],
    },
];

export default function SitemapPage() {
    return (
        <main className="min-h-screen bg-white pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-4 mb-16">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                            <Map className="w-6 h-6 text-[#1a1a2e]" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#1a1a2e]">Sitemap</h1>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {sitemapData.map((section, idx) => (
                            <div key={idx} className="space-y-8">
                                <h2 className="text-2xl font-bold text-[#1a1a2e] border-b border-gray-100 pb-4">
                                    {section.title}
                                </h2>
                                <ul className="space-y-4">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <Link
                                                href={createPageUrl(link.url)}
                                                className="text-gray-600 hover:text-blue-600 flex items-center gap-2 group transition-colors"
                                            >
                                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -ml-6 group-hover:ml-0" />
                                                <span className="font-medium">{link.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
