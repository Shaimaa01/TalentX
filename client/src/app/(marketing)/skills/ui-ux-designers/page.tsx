'use client';

import SkillLandingPage from '@/widgets/landing/SkillLandingPage';

const experts = [
    {
        name: 'Lydia Grant',
        role: 'Principal Product Designer',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
        company: 'AIRBNB',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Belo.svg',
    },
];

const topSkills = [
    { name: 'Figma', category: 'Design' },
    { name: 'Prototyping', category: 'UX' },
    { name: 'User Research', category: 'UX' },
    { name: 'Motion Design', category: 'UI' },
    { name: 'Design Systems', category: 'Infrastructure' },
];

export default function UiUxDesignersPage() {
    return (
        <SkillLandingPage
            skillName="UI/UX Designers"
            title="Hire the Top 10% of Designers"
            description="Create delightful experiences with designers who combine aesthetic excellence with deep psychological insight."
            experts={experts as any}
            topSkills={topSkills}
        />
    );
}
