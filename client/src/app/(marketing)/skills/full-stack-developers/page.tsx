'use client';

import SkillLandingPage from '@/widgets/landing/SkillLandingPage';

const experts = [
    {
        name: 'Alexander Reed',
        role: 'Full-Stack Developer',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
        company: 'VERCEL',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg',
    },
    {
        name: 'Mia Tanaka',
        role: 'Next.js Specialist',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop',
        company: 'FACEBOOK',
        companyLogo:
            'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    },
];

const topSkills = [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'GraphQL', category: 'API' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'AWS', category: 'Cloud' },
];

export default function FullStackDevelopersPage() {
    return (
        <SkillLandingPage
            skillName="Full-Stack Developers"
            title="Hire the Top 10% of Full-Stack Developers"
            description="Bridge the gap between vision and reality with versatile developers who master both frontend experiences and backend infrastructure."
            experts={experts as any}
            topSkills={topSkills}
        />
    );
}
