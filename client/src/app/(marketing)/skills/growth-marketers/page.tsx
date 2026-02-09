'use client';

import SkillLandingPage from '@/widgets/landing/SkillLandingPage';

const experts = [
    {
        name: 'Ben Taylor',
        role: 'Growth Lead',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
        company: 'HUBSPOT',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/HubSpot_Logo.svg',
    },
];

const topSkills = [
    { name: 'Performance Marketing', category: 'Growth' },
    { name: 'SEO/SEM', category: 'Growth' },
    { name: 'A/B Testing', category: 'Strategy' },
    { name: 'Content Strategy', category: 'Content' },
    { name: 'Data Analytics', category: 'Analysis' },
];

export default function GrowthMarketersPage() {
    return (
        <SkillLandingPage
            skillName="Growth Marketers"
            title="Hire the Top 10% of Marketers"
            description="Scale your customer acquisition and retention with data-driven growth experts who have scaled startups to unicorns."
            experts={experts as any}
            topSkills={topSkills}
        />
    );
}
