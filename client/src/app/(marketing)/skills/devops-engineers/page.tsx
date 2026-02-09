'use client';

import SkillLandingPage from '@/widgets/landing/SkillLandingPage';

const experts = [
    {
        name: 'Viktor Petrov',
        role: 'Site Reliability Engineer',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
        company: 'CLOUDFARE',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.svg',
    },
];

const topSkills = [
    { name: 'Kubernetes', category: 'Orchestration' },
    { name: 'Docker', category: 'Containerization' },
    { name: 'Terraform', category: 'IaC' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'CI/CD', category: 'Process' },
    { name: 'Prometheus', category: 'Monitoring' },
];

export default function DevOpsEngineersPage() {
    return (
        <SkillLandingPage
            skillName="DevOps Engineers"
            title="Hire the Top 10% of DevOps Engineers"
            description="Automate your deployment pipeline and ensure 99.9% uptime with elite site reliability and infrastructure experts."
            experts={experts as any}
            topSkills={topSkills}
        />
    );
}
