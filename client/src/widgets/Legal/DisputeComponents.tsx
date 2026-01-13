import React, { useState } from 'react';
import { Button } from "@/shared/components/ui/button";
import { talentXApi } from '@/shared/api/talentXApi';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface DisputeModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    onDisputeCreated?: () => void;
}

export function DisputeModal({ isOpen, onClose, projectId, onDisputeCreated }: DisputeModalProps) {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await talentXApi.Legal.Disputes.create({
                projectId,
                reason,
                description
            });
            toast.success("Dispute Filed", {
                description: "The project has been frozen. Our support team will review this shortly."
            });
            if (onDisputeCreated) onDisputeCreated();
            onClose();
        } catch (error: any) {
            toast.error("Error", { description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-red-100"
                    >
                        <div className="p-6 border-b border-red-50 flex items-center justify-between bg-red-50/30">
                            <div className="flex items-center gap-3 text-red-600">
                                <div className="p-2 bg-red-100 rounded-xl">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Raise a Dispute</h3>
                                    <p className="text-xs text-red-500 font-medium">Funds will be frozen immediately</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-red-100">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-sm text-red-700 leading-relaxed">
                                <span className="font-bold">Warning:</span> Filing a dispute will freeze all funds and milestones associated with this project. An admin will mediate to resolve the issue.
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Reason for Dispute</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Non-delivery of work, Unresponsive client"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Detailed Description</label>
                                    <textarea
                                        placeholder="Please provide specific details regarding the issue..."
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none text-sm leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/30">
                            <Button variant="ghost" onClick={onClose} className="rounded-xl px-6">
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !reason || !description}
                                className="rounded-xl px-8 shadow-lg shadow-red-200"
                            >
                                {isSubmitting ? 'Submitting...' : 'File Dispute & Freeze Funds'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

interface DisputeBannerProps {
    projectId: string;
    isFrozen: boolean;
}

export function DisputeBanner({ isFrozen }: DisputeBannerProps) {
    if (!isFrozen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-red-600 rounded-2xl shadow-xl shadow-red-200 text-white relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <ShieldAlert size={160} />
            </div>

            <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                    <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold">Project Funds Frozen</h3>
                    <p className="text-white/80 text-sm mt-1 leading-relaxed max-w-2xl">
                        This project is currently under dispute resolution. All payments and milestone releases are locked until an admin reaches a decision. Our support team is investigating.
                    </p>
                    <div className="mt-4 flex gap-3">
                        <Button variant="secondary" size="sm" className="bg-white text-red-600 hover:bg-gray-100 font-bold px-6">
                            Check Status
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
