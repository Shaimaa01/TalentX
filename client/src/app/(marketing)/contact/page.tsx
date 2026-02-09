'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, MapPin, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white">
            <section className="relative pt-24 pb-32 overflow-hidden border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:flex gap-16 items-start">
                        <div className="lg:w-1/2 mb-16 lg:mb-0">
                            <h1 className="text-4xl lg:text-6xl font-bold text-[#1a1a2e] leading-tight mb-8">
                                Let's Talk About Your <span className="text-blue-600">Growth</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed max-w-xl mb-12">
                                Our talent experts are ready to help you find the specialists you
                                need. Reach out today and start building your dream team.
                            </p>

                            <div className="space-y-8">
                                {[
                                    { icon: Mail, label: 'Email Us', value: 'hello@talentx.ai' },
                                    { icon: Phone, label: 'Call Us', value: '+1 (555) 000-0000' },
                                    {
                                        icon: MessageSquare,
                                        label: 'Live Chat',
                                        value: 'Available 24/7',
                                    },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                            <item.icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                                {item.label}
                                            </div>
                                            <div className="text-lg font-bold text-[#1a1a2e]">
                                                {item.value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 lg:p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 clip-path-polygon-[100%_0,100%_100%,0_100%]"></div>

                                <form className="space-y-6 relative z-10">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                Work Email
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                                                placeholder="john@company.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                                            placeholder="Acme Inc."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            How can we help?
                                        </label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-blue-500 outline-none transition-all resize-none"
                                            placeholder="Tell us about your project..."
                                        ></textarea>
                                    </div>
                                    <Button className="w-full bg-[#1a1a2e] hover:bg-black text-white font-bold py-8 text-lg rounded-[4px] shadow-lg">
                                        Send Message
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offices Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#1a1a2e]">Global Presence</h2>
                        <p className="mt-4 text-gray-600">
                            While our network is global, our hearts are in these innovation hubs.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { city: 'San Francisco', address: 'Market St, Suite 400', time: 'PST' },
                            {
                                city: 'London',
                                address: 'Old Street, Silicon Roundabout',
                                time: 'GMT',
                            },
                            { city: 'Dubai', address: 'DIFC, Innovation Hub', time: 'GST' },
                        ].map((office, idx) => (
                            <div
                                key={idx}
                                className="p-8 border border-gray-100 rounded-sm hover:border-blue-500/20 hover:shadow-xl transition-all"
                            >
                                <MapPin className="w-6 h-6 text-blue-600 mb-6" />
                                <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
                                    {office.city}
                                </h3>
                                <p className="text-gray-500 mb-4">{office.address}</p>
                                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                                    {office.time} Timezone
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
