'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
    const lastUpdated = 'October 24, 2023';

    return (
        <main className="min-h-screen bg-white pt-24 pb-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl lg:text-5xl font-bold text-[#1a1a2e] mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-500 font-medium mb-12">Last Updated: {lastUpdated}</p>

                    <div className="prose prose-slate max-w-none space-y-12 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                1. Introduction
                            </h2>
                            <p>
                                Welcome to TalentX ("we," "our," or "us"). We are committed to
                                protecting your personal information and your right to privacy. This
                                Privacy Policy explains how we collect, use, disclose, and safeguard
                                your information when you visit our website and use our services.
                            </p>
                            <p className="mt-4">
                                Please read this privacy policy carefully. If you do not agree with
                                the terms of this privacy policy, please do not access the site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                2. Information Collection
                            </h2>
                            <p>
                                We collect personal information that you voluntarily provide to us
                                when you register on the website, express an interest in obtaining
                                information about us or our products and services, or otherwise when
                                you contact us.
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>
                                    <strong>Personal Data:</strong> Name, email address, phone
                                    number, and professional background.
                                </li>
                                <li>
                                    <strong>Usage Data:</strong> Information about how you use our
                                    website, including IP address, browser type, and operating
                                    system.
                                </li>
                                <li>
                                    <strong>Cookies:</strong> We use cookies and similar tracking
                                    technologies to track activity on our service and hold certain
                                    information.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                3. How We Use Your Information
                            </h2>
                            <p>We use the information we collect or receive to:</p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>Facilitate account creation and logon process.</li>
                                <li>
                                    Match clients with suitable talent based on skills and
                                    preferences.
                                </li>
                                <li>Send administrative information to you.</li>
                                <li>Protect our services and users from fraudulent activity.</li>
                                <li>Improve our website and service offerings.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                4. Data Sharing and Disclosure
                            </h2>
                            <p>
                                We may share information we have collected about you in certain
                                situations. Your information may be disclosed as follows:
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>
                                    <strong>With Service Providers:</strong> We may share your
                                    information with third-party vendors who perform services for
                                    us.
                                </li>
                                <li>
                                    <strong>By Law or to Protect Rights:</strong> If we believe the
                                    release of information about you is necessary to respond to
                                    legal process.
                                </li>
                                <li>
                                    <strong>Business Transfers:</strong> We may share or transfer
                                    your information in connection with any merger, sale of company
                                    assets, or financing.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                5. Data Security
                            </h2>
                            <p>
                                We use administrative, technical, and physical security measures to
                                help protect your personal information. While we have taken
                                reasonable steps to secure the personal information you provide to
                                us, please be aware that despite our efforts, no security measures
                                are perfect or impenetrable.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                6. Contact Us
                            </h2>
                            <p>
                                If you have questions or comments about this Privacy Policy, please
                                contact us at:
                            </p>
                            <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="font-bold text-[#1a1a2e]">TalentX Privacy Team</p>
                                <p>Email: privacy@talentx.ai</p>
                                <p>Address: Market St, Suite 400, San Francisco, CA</p>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
