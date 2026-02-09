'use client';

import SkillLandingPage from '@/widgets/landing/SkillLandingPage';

const experts = [
    {
        name: 'Rachel Stern',
        role: 'Security Researcher',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop',
        company: 'PALANTIR',
        companyLogo:
            'https://upload.wikimedia.org/wikipedia/commons/1/13/Palantir_Technologies_logo.svg',
    },
];

const topSkills = [
    { name: 'Penetration Testing', category: 'Offensive' },
    { name: 'Network Security', category: 'Defensive' },
    { name: 'SOC2 Compliance', category: 'Regulatory' },
    { name: 'Incident Response', category: 'Process' },
    { name: 'Cryptography', category: 'Core' },
];

export default function CybersecurityConsultantsPage() {
    return (
        <SkillLandingPage
            skillName="Cybersecurity Consultants"
            title="Hire the Top 10% of Security Experts"
            description="Protect your organization's assets and build secure systems with world-class ethical hackers and security researchers."
            experts={experts as any}
            topSkills={topSkills}
        />
    );
}
