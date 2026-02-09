'use client';

import SkillLandingPage from '@/widgets/landing/SkillLandingPage';

const experts = [
    {
        name: 'Igor Volkov',
        role: 'Solidity Architect',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
        company: 'COINBASE',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Coinbase_logo_2018.svg',
    },
];

const topSkills = [
    { name: 'Solidity', category: 'Language' },
    { name: 'Rust', category: 'Language' },
    { name: 'Smart Contracts', category: 'Core' },
    { name: 'Web3.js', category: 'Library' },
    { name: 'Hardhat', category: 'DevOps' },
];

export default function BlockchainDevelopersPage() {
    return (
        <SkillLandingPage
            skillName="Blockchain Developers"
            title="Hire the Top 10% of Web3 Engineers"
            description="Build secure, decentralized applications and smart contracts with elite blockchain architects and security researchers."
            experts={experts as any}
            topSkills={topSkills}
        />
    );
}
