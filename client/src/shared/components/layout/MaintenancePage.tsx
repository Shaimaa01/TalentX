'use client';

import React from 'react';
import { Settings, Clock, ShieldAlert } from 'lucide-react';

const MaintenancePage = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center animate-bounce">
                            <Settings className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center">
                            <ShieldAlert className="w-12 h-12 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold text-[#1a1a2e] tracking-tight">
                        Under Maintenance
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        We're currently updating TalentX to provide you with a even better
                        experience. We'll be back shortly!
                    </p>
                </div>

                <div className="bg-gray-50 rounded-3xl p-6 flex items-center justify-center gap-4 border border-gray-100">
                    <Clock className="w-6 h-6 text-blue-500" />
                    <div className="text-left">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Estimated Recovery
                        </p>
                        <p className="text-lg font-bold text-[#1a1a2e]">Approximately 2 hours</p>
                    </div>
                </div>

                <div className="pt-8 flex flex-col items-center space-y-4">
                    <p className="text-sm text-gray-400">Need urgent assistance?</p>
                    <a
                        href="mailto:support@talentx.ai"
                        className="text-blue-600 font-bold hover:underline"
                    >
                        support@talentx.ai
                    </a>
                </div>

                <div className="pt-12 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                    TalentX © 2026 • Enterprise Grade Talent Matching
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;
