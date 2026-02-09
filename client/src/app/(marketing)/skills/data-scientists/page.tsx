'use client';

import SkillLandingPage from '@/widgets/landing/SkillLandingPage';

const experts = [
    {
        name: 'Dr. Elena Rossi',
        role: 'Data Scientist',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
        company: 'AIRBNB',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Belo.svg',
    },
    {
        name: 'Rahul Mehra',
        role: 'Machine Learning Researcher',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
        company: 'UBER',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.svg',
    },
    {
        name: 'Sophie Bennett',
        role: 'Data Analyst',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
        company: 'NETFLIX',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    },
    {
        name: 'Carlos Mendez',
        role: 'Statistically Lead',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
        company: 'SPOTIFY',
        companyLogo:
            'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg',
    },
    {
        name: 'Lila Vos',
        role: 'Quant Analyst',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop',
        company: 'GOLDMAN SACHS',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs_logo.svg',
    },
    {
        name: 'Kenji Sato',
        role: 'Data Engineer',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
        company: 'SONY',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
    },
];

const topSkills = [
    { name: 'Python', category: 'Language' },
    { name: 'R', category: 'Language' },
    { name: 'NLP', category: 'Field' },
    { name: 'TensorFlow', category: 'Library' },
    { name: 'SQL', category: 'Database' },
    { name: 'Deep Learning', category: 'Field' },
    { name: 'Tableau', category: 'Visualization' },
    { name: 'Spark', category: 'Big Data' },
    { name: 'Pandas', category: 'Library' },
    { name: 'Scikit-learn', category: 'Library' },
];

export default function DataScientistsPage() {
    return (
        <SkillLandingPage
            skillName="Data Scientists"
            title="Hire the Top 10% of Data Scientists"
            description="Extract actionable insights from your data with elite scientists specialized in predictive modeling, statistical analysis, and machine learning."
            experts={experts}
            topSkills={topSkills}
        />
    );
}
