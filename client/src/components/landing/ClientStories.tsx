'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Story {
    id: string;
    company: string;
    logo: string;
    thumbnail: string;
    videoUrl: string;
}

const stories: Story[] = [
    {
        id: '1',
        company: 'Precision Drilling',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', // Placeholder white logo
        thumbnail: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80',
        videoUrl: '#'
    },
    {
        id: '2',
        company: 'Bridgestone',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', // Placeholder
        thumbnail: 'https://images.unsplash.com/photo-1504384308090-c89eeccc9f30?w=800&q=80',
        videoUrl: '#'
    },
    {
        id: '3',
        company: 'Cleveland Cavaliers',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', // Placeholder
        thumbnail: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80',
        videoUrl: '#'
    },
    {
        id: '4',
        company: 'Zoetis',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', // Placeholder
        thumbnail: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800&q=80',
        videoUrl: '#'
    },
    {
        id: '5',
        company: 'CSR',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png', // Placeholder
        thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        videoUrl: '#'
    },
    {
        id: '6',
        company: 'USC',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png', // Placeholder
        thumbnail: 'https://images.unsplash.com/photo-1523050335192-ce1de947015a?w=800&q=80',
        videoUrl: '#'
    }
];

export default function ClientStories() {
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);

    return (
        <section className="py-24 bg-white text-black overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1a1a2e]">Why Organizations Choose TalentX</h2>
                    <p className="text-gray-500 max-w-3xl mx-auto text-lg">
                        Discover the many ways in which our clients have embraced the benefits of working with TalentX.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-4">
                    {stories.map((story, index) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative cursor-pointer w-[380px] h-[400px] overflow-hidden bg-gray-900 shadow-xl"
                            onClick={() => setSelectedStory(story)}
                        >
                            {/* Card Content */}
                            <img
                                src={story.thumbnail}
                                alt={story.company}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

                            {/* Top Left: Logo */}
                            <div className="absolute top-6 left-6">
                                <img
                                    src={story.logo}
                                    alt={story.company}
                                    className="h-8 w-auto filter brightness-0 invert opacity-90"
                                />
                                <span className="block mt-2 text-white font-bold text-lg">{story.company}</span>
                            </div>

                            {/* Bottom Left: Play Button */}
                            <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#204ecf]/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                </div>
                                <span className="text-white font-semibold text-sm">Watch the video</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                        onClick={() => setSelectedStory(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
                                onClick={() => setSelectedStory(null)}
                            >
                                <X className="w-6 h-6" />
                            </Button>

                            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-[#204ecf] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Video playback for {selectedStory.company}</h3>
                                    <p className="text-gray-400">Simulation of client story video</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
