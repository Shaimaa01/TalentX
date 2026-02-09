'use client';

import SkillLandingPage from '@/widgets/landing/SkillLandingPage';

const experts = [
    {
        name: 'James Miller',
        role: 'Senior Python Developer',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
        company: 'INSTAGRAM',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
    },
    {
        name: 'Sophia Zhang',
        role: 'Django Architect',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
        company: 'DROPBOX',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Dropbox_logo_2017.svg',
    },
    {
        name: "Liam O'Connor",
        role: 'Flask Specialist',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
        company: 'REDDIT',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Reddit_logo.svg',
    },
    {
        name: 'Chloe Lewis',
        role: 'Backend Engineer',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
        company: 'STRIPE',
        companyLogo:
            'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    },
];

const topSkills = [
    { name: 'Django', category: 'Framework' },
    { name: 'Flask', category: 'Framework' },
    { name: 'FastAPI', category: 'Framework' },
    { name: 'NumPy', category: 'Library' },
    { name: 'Pandas', category: 'Library' },
    { name: 'Celery', category: 'Queue' },
    { name: 'Redis', category: 'Cache' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Pytest', category: 'Testing' },
    { name: 'Docker', category: 'DevOps' },
];

export default function PythonExpertsPage() {
    return (
        <SkillLandingPage
            skillName="Python Experts"
            title="Hire the Top 10% of Python Developers"
            description="Build scalable backends, complex data pipelines, and intelligent automation with elite Python engineers."
            experts={experts as any}
            topSkills={topSkills}
        />
    );
}
