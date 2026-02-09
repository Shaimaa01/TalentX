import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { talentXApi } from '@/shared/api/talentXApi';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle, ArrowRight, Gavel } from 'lucide-react';
import { toast } from 'sonner';
import { Dispute } from '@/shared/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDisputePanel() {
    const queryClient = useQueryClient();

    const { data: disputes, isLoading } = useQuery({
        queryKey: ['admin-disputes'],
        queryFn: async () => talentXApi.Legal.Disputes.listAll(),
    });

    const resolveMutation = useMutation({
        mutationFn: ({
            id,
            resolution,
            status,
        }: {
            id: string;
            resolution: string;
            status: 'resolved' | 'dismissed';
        }) => talentXApi.Legal.Disputes.resolve(id, { resolution, status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Dispute resolved successfully');
        },
        onError: (error: any) => {
            toast.error('Failed to resolve dispute', { description: error.message });
        },
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <Badge className="bg-red-500">Open</Badge>;
            case 'under_review':
                return <Badge className="bg-yellow-500">Reviewing</Badge>;
            case 'resolved':
                return <Badge className="bg-green-500">Resolved</Badge>;
            case 'dismissed':
                return <Badge variant="outline">Dismissed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading disputes...</div>;

    const openDisputes = (disputes || []).filter(
        (d: Dispute) => d.status === 'open' || d.status === 'under_review'
    );
    const resolvedDisputes = (disputes || []).filter(
        (d: Dispute) => d.status === 'resolved' || d.status === 'dismissed'
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                    <Gavel className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-[#1a1a2e]">Dispute Resolution Center</h2>
                    <p className="text-gray-500">
                        Manage and resolve conflicts between clients and talent.
                    </p>
                </div>
            </div>

            {/* Active Disputes */}
            <div className="grid gap-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    Active Mediation Cases
                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                        {openDisputes.length}
                    </Badge>
                </h3>

                {openDisputes.length === 0 ? (
                    <Card className="bg-gray-50 border-dashed">
                        <CardContent className="py-12 text-center text-gray-400 italic">
                            No active disputes found.
                        </CardContent>
                    </Card>
                ) : (
                    openDisputes.map((dispute) => (
                        <MediationCard
                            key={dispute.id}
                            dispute={dispute}
                            onResolve={(res, status) =>
                                resolveMutation.mutate({ id: dispute.id, resolution: res, status })
                            }
                            isResolving={resolveMutation.isPending}
                        />
                    ))
                )}
            </div>

            {/* Past Cases */}
            <div className="space-y-6 pt-8 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Resolution History</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {resolvedDisputes.map((dispute) => (
                        <Card
                            key={dispute.id}
                            className="opacity-80 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 transition-all"
                        >
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] uppercase font-bold"
                                        >
                                            Case #{dispute.id.slice(0, 8)}
                                        </Badge>
                                        {getStatusBadge(dispute.status)}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(dispute.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1">{dispute.reason}</h4>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {dispute.description}
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                                    <span>Resolution: {dispute.resolution}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MediationCard({
    dispute,
    onResolve,
    isResolving,
}: {
    dispute: Dispute;
    onResolve: (res: string, status: 'resolved' | 'dismissed') => void;
    isResolving: boolean;
}) {
    const [resolution, setResolution] = React.useState('');
    const [isActionOpen, setIsActionOpen] = React.useState(false);

    return (
        <Card className="overflow-hidden border-2 border-red-50 shadow-md hover:border-red-100 transition-all">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    <div className="p-8 flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <Badge className="bg-red-500 text-white font-bold px-3 py-1">
                                #{dispute.id.slice(0, 8)}
                            </Badge>
                            <Badge className="bg-red-50 text-red-600 border-red-100 uppercase tracking-widest text-[10px] font-bold">
                                Immediate Attention
                            </Badge>
                            <span className="text-sm text-gray-400 ml-auto flex items-center gap-1">
                                <ArrowRight className="w-3 h-3" /> Filed{' '}
                                {new Date(dispute.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">{dispute.reason}</h3>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Claim Description
                            </h4>
                            <p className="text-gray-700 leading-relaxed italic">
                                "{dispute.description}"
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                    {dispute.initiator?.full_name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">
                                        Initiator
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {dispute.initiator?.full_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-96 bg-gray-50/50 p-8 border-l border-gray-100 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            {!isActionOpen ? (
                                <motion.div
                                    key="initial"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <h4 className="font-bold text-[#1a1a2e]">Mediation Decision</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        As an administrator, your decision is final. Review the case
                                        and the legal contracts before resolving.
                                    </p>
                                    <Button
                                        onClick={() => setIsActionOpen(true)}
                                        className="w-full bg-[#1a1a2e] hover:bg-black text-white rounded-xl py-6 font-bold"
                                    >
                                        Take Action
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="deciding"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-4"
                                >
                                    <textarea
                                        placeholder="Explain the mediation outcome..."
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm h-32"
                                        value={resolution}
                                        onChange={(e) => setResolution(e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="destructive"
                                            className="rounded-xl font-bold py-6 bg-red-600"
                                            onClick={() => onResolve(resolution, 'resolved')}
                                            disabled={isResolving || !resolution.trim()}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Resolve Case
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl font-bold py-6"
                                            onClick={() => onResolve(resolution, 'dismissed')}
                                            disabled={isResolving || !resolution.trim()}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Dismiss
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-xs"
                                        onClick={() => setIsActionOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
