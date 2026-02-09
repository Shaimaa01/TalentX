'use client';

import SkillLandingPage from '@/widgets/landing/SkillLandingPage';

const experts = [
    {
        name: 'Sarah Jenkins',
        role: 'Fractional CFO',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop',
        company: 'GOLDMAN SACHS',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs_logo.svg',
    },
];

const topSkills = [
    { name: 'Financial Modeling', category: 'Core' },
    { name: 'Fundraising Strategy', category: 'Strategic' },
    { name: 'Treasury Management', category: 'Operational' },
    { name: 'Exit Strategy', category: 'Strategic' },
    { name: 'Tax Optimization', category: 'Operational' },
];

export default function FractionalCfosPage() {
    return (
        <SkillLandingPage
            skillName="Fractional CFOs"
            title="Hire the Top 10% of Financial Leaders"
            description="Get executive-level financial leadership for your growing business without the cost of a full-time hire."
            experts={experts as any}
            topSkills={topSkills}
        />
    );
}
