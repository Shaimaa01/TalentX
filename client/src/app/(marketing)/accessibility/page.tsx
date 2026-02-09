'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Accessibility } from 'lucide-react';

export default function AccessibilityPage() {
    return (
        <main className="min-h-screen bg-white pt-24 pb-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Accessibility className="w-6 h-6 text-blue-600" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#1a1a2e]">
                            Accessibility
                        </h1>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-12 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                Our Commitment
                            </h2>
                            <p>
                                TalentX is committed to ensuring digital accessibility for people
                                with disabilities. We are continually improving the user experience
                                for everyone and applying the relevant accessibility standards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                Conformance Status
                            </h2>
                            <p>
                                The Web Content Accessibility Guidelines (WCAG) defines requirements
                                for designers and developers to improve accessibility for people
                                with disabilities. It defines three levels of conformance: Level A,
                                Level AA, and Level AAA. TalentX is partially conformant with WCAG
                                2.1 level AA. Partially conformant means that some parts of the
                                content do not fully conform to the accessibility standard.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Feedback</h2>
                            <p>
                                We welcome your feedback on the accessibility of TalentX. Please let
                                us know if you encounter accessibility barriers on TalentX:
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>
                                    <strong>Email:</strong> accessibility@talentx.ai
                                </li>
                                <li>
                                    <strong>Phone:</strong> +1 (555) 000-0000
                                </li>
                            </ul>
                            <p className="mt-6">
                                We try to respond to feedback within 5 business days.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                Compatibility with Browsers and Assistive Technology
                            </h2>
                            <p>
                                TalentX is designed to be compatible with the following assistive
                                technologies:
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>
                                    Chrome, Firefox, Safari, and Edge on Windows, macOS, and mobile
                                    devices.
                                </li>
                                <li>Screen readers like NVDA, JAWS, and VoiceOver.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                Technical Specifications
                            </h2>
                            <p>
                                Accessibility of TalentX relies on the following technologies to
                                work with the particular combination of web browser and any
                                assistive technologies or plugins installed on your computer:
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>HTML</li>
                                <li>WAI-ARIA</li>
                                <li>CSS</li>
                                <li>JavaScript</li>
                            </ul>
                        </section>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
