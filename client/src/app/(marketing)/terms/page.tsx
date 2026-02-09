'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsPage() {
    const lastUpdated = 'October 24, 2023';

    return (
        <main className="min-h-screen bg-white pt-24 pb-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl lg:text-5xl font-bold text-[#1a1a2e] mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-gray-500 font-medium mb-12">Last Updated: {lastUpdated}</p>

                    <div className="prose prose-slate max-w-none space-y-12 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                1. Agreement to Terms
                            </h2>
                            <p>
                                These Terms of Service constitute a legally binding agreement made
                                between you, whether personally or on behalf of an entity ("you")
                                and TalentX ("we," "us," or "our"), concerning your access to and
                                use of the TalentX website as well as any other media form, media
                                channel, mobile website or mobile application related, linked, or
                                otherwise connected thereto.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                2. Intellectual Property Rights
                            </h2>
                            <p>
                                Unless otherwise indicated, the Site is our proprietary property and
                                all source code, databases, functionality, software, website
                                designs, audio, video, text, photographs, and graphics on the Site
                                and the trademarks, service marks, and logos contained therein are
                                owned or controlled by us or licensed to us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                3. User Representations
                            </h2>
                            <p>
                                By using the Site, you represent and warrant that: (1) all
                                registration information you submit will be true, accurate, current,
                                and complete; (2) you will maintain the accuracy of such information
                                and promptly update such registration information as necessary; (3)
                                you have the legal capacity and you agree to comply with these Terms
                                of Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                4. Prohibited Activities
                            </h2>
                            <p>
                                You may not access or use the Site for any purpose other than that
                                for which we make the Site available. The Site may not be used in
                                connection with any commercial endeavors except those that are
                                specifically endorsed or approved by us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                5. Service Marketplace
                            </h2>
                            <p>
                                TalentX is a marketplace platform. We do not employ the talent
                                listed on our platform. The relationship is between the client and
                                the independent contractor. We provide the infrastructure for
                                matching, communication, and payments.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                6. Limitation of Liability
                            </h2>
                            <p>
                                In no event will we or our directors, employees, or agents be liable
                                to you or any third party for any direct, indirect, consequential,
                                exemplary, incidental, special, or punitive damages, including lost
                                profit, lost revenue, loss of data, or other damages arising from
                                your use of the site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                7. Governing Law
                            </h2>
                            <p>
                                These Terms of Service and your use of the Site are governed by and
                                construed in accordance with the laws of the State of California
                                applicable to agreements made and to be entirely performed within
                                the State of California, without regard to its conflict of law
                                principles.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
