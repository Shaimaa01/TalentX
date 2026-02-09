/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.message.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.teamMember.deleteMany();
    await prisma.team.deleteMany();
    await prisma.agency.deleteMany();
    await prisma.talent.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@talentx.com',
            password: hashedPassword,
            full_name: 'Admin User',
            role: 'admin',
            avatar_url: 'https://ui-avatars.com/api/?name=Admin+User&background=000&color=fff',
        },
    });

    // Create Client
    const clientUser = await prisma.user.create({
        data: {
            email: 'demo@example.com',
            password: hashedPassword,
            full_name: 'Demo Client',
            role: 'client',
            avatar_url: 'https://ui-avatars.com/api/?name=Demo+Client',
        },
    });

    // Helper for random roles and categories
    const roles = [
        'Product Designer',
        'React Developer',
        'Node.js Developer',
        'UX Researcher',
        'DevOps Engineer',
        'Data Scientist',
        'Marketing Specialist',
        'Product Manager',
        'Project Manager',
        'Financial Analyst',
    ];
    const categories = [
        'designer',
        'developer',
        'developer',
        'designer',
        'developer',
        'developer',
        'marketing',
        'product_manager',
        'project_manager',
        'finance',
    ];
    const skillsList = [
        ['Figma', 'UI/UX'],
        ['React', 'Next.js'],
        ['Node.js', 'Express'],
        ['User Research', 'Usability Testing'],
        ['AWS', 'Docker'],
        ['Python', 'Pandas'],
        ['SEO', 'Content Marketing'],
        ['Agile', 'Jira'],
        ['Scrum', 'Planning'],
        ['Excel', 'Financial Modeling'],
    ];
    const locations = [
        'San Francisco, CA',
        'New York, NY',
        'London, UK',
        'Berlin, DE',
        'Toronto, CA',
        'Singapore',
        'Sydney, AU',
        'Bangalore, IN',
    ];

    // Create 30 Talents
    const talents = [];
    for (let i = 1; i <= 30; i++) {
        const user = await prisma.user.create({
            data: {
                email: `talent${i}@example.com`,
                password: hashedPassword,
                full_name: `Talent ${i}`,
                role: 'talent',
                avatar_url: `https://ui-avatars.com/api/?name=Talent+${i}&background=random`,
            },
        });

        const roleIndex = i % roles.length;
        const talent = await prisma.talent.create({
            data: {
                userId: user.id,
                title: roles[roleIndex],
                category: categories[roleIndex],
                expertise: JSON.stringify(skillsList[roleIndex]),
                hourly_rate: 50 + Math.floor(Math.random() * 100),
                experience_years: 3 + Math.floor(Math.random() * 10),
                availability: Math.random() > 0.2 ? 'available' : 'busy',
                bio: `Experienced professional with a passion for ${roles[roleIndex]}.`,
                skills: JSON.stringify(skillsList[roleIndex]),
                previous_companies: JSON.stringify(['Google', 'Amazon', 'Startup Inc']),
                image_url: `https://ui-avatars.com/api/?name=Talent+${i}&background=random`,
                location: locations[i % locations.length],
                lat: 30 + Math.random() * 20,
                lng: -100 + Math.random() * 200,
                rating: 4.0 + Math.random(),
                completed_projects: Math.floor(Math.random() * 50),
            },
        });
        talents.push(talent);
    }

    // Create 15 Agencies
    for (let i = 1; i <= 15; i++) {
        const user = await prisma.user.create({
            data: {
                email: `agency${i}@example.com`,
                password: hashedPassword,
                full_name: `Agency ${i} CEO`,
                role: 'agency',
                avatar_url: `https://ui-avatars.com/api/?name=Agency+${i}&background=random`,
            },
        });

        await prisma.agency.create({
            data: {
                userId: user.id,
                agency_name: `Agency ${i} Solutions`,
                description: `Top-tier agency ${i} specializing in digital solutions.`,
                services: JSON.stringify(['Web Development', 'Mobile Apps', 'Design Systems']),
                team_size: 10 + Math.floor(Math.random() * 100),
                hourly_rate_range: `$${100 + i * 5} - $${200 + i * 10}`,
                location: locations[i % locations.length],
                lat: 30 + Math.random() * 20,
                lng: -100 + Math.random() * 200,
                founded_year: 2010 + (i % 10),
                completed_projects: 20 + i * 5,
                rating: 4.5 + (i % 5) * 0.1,
                image_url: `https://ui-avatars.com/api/?name=Agency+${i}&background=random`,
            },
        });
    }

    // Create 10 Teams
    for (let i = 1; i <= 10; i++) {
        const team = await prisma.team.create({
            data: {
                team_name: `Team ${i} Velocity`,
                specialization: i % 2 === 0 ? 'full_stack_development' : 'design_team',
                team_size: 3 + (i % 5),
                hourly_rate: 300 + i * 20,
                availability: 'available',
                rating: 4.5 + (i % 5) * 0.1,
                project_timeline: `${3 + (i % 6)} months`,
                description: `High-performance team ${i} specialized in modern tech stacks.`,
                image_url: `https://ui-avatars.com/api/?name=Team+${i}&background=random`,
                location: locations[i % locations.length],
                lat: 30 + Math.random() * 20,
                lng: -100 + Math.random() * 200,
            },
        });

        // Add some members to the team
        for (let j = 0; j < 3; j++) {
            const talent = talents[(i * 3 + j) % talents.length];
            await prisma.teamMember.create({
                data: {
                    teamId: team.id,
                    talentId: talent.id,
                    role: j === 0 ? 'Lead' : 'Member',
                },
            });
        }
    }

    // Create a sample project for the first talent
    const project = await prisma.project.create({
        data: {
            name: 'E-commerce Redesign',
            client_email: clientUser.email,
            clientId: clientUser.id,
            status: 'active',
            description: 'Redesigning the main product page and checkout flow.',
            assignedType: 'talent',
            talentId: talents[0].id,
        },
    });

    // Create Tasks for the project
    await prisma.task.createMany({
        data: [
            {
                projectId: project.id,
                title: 'Design System Update',
                description: 'Update the color palette and typography in the design system.',
                status: 'done',
                priority: 'high',
                assigneeId: talents[0].userId,
            },
            {
                projectId: project.id,
                title: 'Checkout Flow Wireframes',
                description: 'Create low-fidelity wireframes for the new checkout process.',
                status: 'in_progress',
                priority: 'high',
                assigneeId: talents[0].userId,
            },
        ],
    });

    // Create a sample message
    await prisma.message.create({
        data: {
            senderId: adminUser.id,
            receiverId: clientUser.id,
            content: 'Welcome to TalentX! How can we help you today?',
        },
    });

    console.log('Database seeded successfully with 30 talents, 15 agencies, and 10 teams!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
