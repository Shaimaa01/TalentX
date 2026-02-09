'use client';

import SkillLandingPage from '@/widgets/landing/SkillLandingPage';

const experts = [
    {
        name: 'Yuki Tanaka',
        role: 'Mobile Lead',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
        company: 'EXPENSIVY',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Expensify_logo.svg',
    },
];

const topSkills = [
    { name: 'React Native', category: 'Mobile' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'iOS/Android', category: 'Platform' },
    { name: 'Redux', category: 'State' },
    { name: 'Native Modules', category: 'Core' },
];

export default function ReactNativeDevelopersPage() {
    return (
        <SkillLandingPage
            skillName="React Native Developers"
            title="Hire the Top 10% of Mobile Engineers"
            description="Deliver high-performance cross-platform mobile apps that feel native and scale effortlessly with elite React Native experts."
            experts={experts as any}
            topSkills={topSkills}
        />
    );
}
