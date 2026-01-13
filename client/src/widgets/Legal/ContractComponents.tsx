import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { talentXApi } from '@/shared/api/talentXApi';
import { Contract } from '@/shared/types';
import { FileText, CheckCircle, PenTool, XCircle } from 'lucide-react';
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, X, Shield, ScrollText, Signature } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/shared/types';
import { jsPDF } from "jspdf";
import { Download } from 'lucide-react';

interface ContractsListProps {
    projectId: string;
    currentUser: any;
}

// Custom Modal Component (extracted from the provided code edit)
interface CustomContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    contract?: Contract | null; // If viewing/signing an existing contract
    projectId: string;
    currentUser: User;
    onSuccess: () => void; // Callback for when an action (create/sign) is successful
}

const NDA_TEMPLATE = `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into by and between the Client and the Contractor.

1. Definition of Confidential Information.
For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.

2. Obligations of Receiving Party.
Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party.

3. Time Periods.
The non-disclosure provisions of this Agreement shall survive the termination of this Agreement and Receiving Party's duty to hold Confidential Information in confidence shall remain in effect until the Confidential Information no longer qualifies as a trade secret or until Disclosing Party sends Receiving Party written notice releasing Receiving Party from this Agreement, or three (3) years, whichever occurs first.
`;

const MSA_TEMPLATE = `MASTER SERVICES AGREEMENT

1. Services.
Contractor agrees to perform the services described in the specific Project Statement of Work (SOW).

2. Compensation.
Client agrees to pay Contractor the fees set forth in the SOW.

3. Intellectual Property.
Contractor agrees that any and all work product derived from the services shall be the sole and exclusive property of the Client (Work for Hire).

4. Term and Termination.
This Agreement shall commence on the date of execution and shall continue until terminated by either party with 14 days written notice.
`;

const templates = [
    { id: 'NDA', name: 'Non-Disclosure Agreement', desc: 'Protect sensitive information shared during the project.', content: NDA_TEMPLATE },
    { id: 'MSA', name: 'Master Services Agreement', desc: 'Outline the general terms for services provided.', content: MSA_TEMPLATE },
];

function CustomContractModal({ isOpen, onClose, contract, projectId, currentUser, onSuccess }: CustomContractModalProps) {
    const queryClient = useQueryClient();
    const [type, setType] = useState<'NDA' | 'MSA'>(contract?.type as 'NDA' | 'MSA' || 'NDA');
    const [content, setContent] = useState(contract?.content || templates[0].content);
    const [signerName, setSignerName] = useState('');

    useEffect(() => {
        if (isOpen && !contract) {
            // Reset for new contract creation
            setType('NDA');
            setContent(templates[0].content);
            setSignerName('');
        } else if (isOpen && contract) {
            // For viewing/signing existing contract
            setType(contract.type as 'NDA' | 'MSA');
            setContent(contract.content);
            setSignerName('');
        }
    }, [isOpen, contract]);

    useEffect(() => {
        if (!contract) { // Only update content if creating a new contract
            const selectedTemplate = templates.find(t => t.id === type);
            if (selectedTemplate) {
                setContent(selectedTemplate.content);
            }
        }
    }, [type, contract]);

    const createMutation = useMutation({
        mutationFn: (newContractData: { projectId: string; type: 'NDA' | 'MSA'; title: string; content: string; clientId: string }) =>
            talentXApi.Legal.Contracts.create(newContractData),
        onSuccess: () => {
            toast.success("Contract created successfully!");
            queryClient.invalidateQueries({ queryKey: ['contracts', projectId] });
            onSuccess();
            onClose();
        },
        onError: (error: any) => {
            toast.error("Failed to create contract", { description: error.message });
        },
    });

    const signMutation = useMutation({
        mutationFn: (data: { contractId: string; signature: string }) =>
            talentXApi.Legal.Contracts.sign(data.contractId, data.signature),
        onSuccess: () => {
            toast.success("Contract signed successfully!");
            queryClient.invalidateQueries({ queryKey: ['contracts', projectId] });
            onSuccess();
            onClose();
        },
        onError: (error: any) => {
            toast.error("Failed to sign contract", { description: error.message });
        },
    });

    const handleCreateContract = () => {
        const selectedTemplate = templates.find(t => t.id === type);
        if (!selectedTemplate) {
            toast.error("Please select a contract type.");
            return;
        }
        createMutation.mutate({
            projectId,
            type,
            title: selectedTemplate.name, // Use template name as title for simplicity
            content,
            clientId: currentUser.id,
        });
    };

    const handleSignContract = () => {
        if (!contract) return;
        if (!signerName.trim()) {
            toast.error("Please type your full name to sign.");
            return;
        }
        signMutation.mutate({ contractId: contract.id, signature: signerName });
    };

    const handleDownload = () => {
        if (!contract) return;
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text(contract.title, 20, 20);

        doc.setFontSize(12);
        doc.text(`Status: ${contract.status.toUpperCase()}`, 20, 30);
        doc.text(`Created: ${new Date(contract.createdAt!).toLocaleDateString()}`, 20, 40);

        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(contract.content, 170);
        doc.text(splitText, 20, 60);

        let y = doc.internal.pageSize.height - 40;

        if (contract.clientSignature) {
            doc.text(`Client Signature: ${contract.clientSignature}`, 20, y);
            doc.text(`Date: ${new Date(contract.clientSignedAt!).toLocaleDateString()}`, 20, y + 5);
        }

        if (contract.contractorSignature) {
            doc.text(`Contractor Signature: ${contract.contractorSignature}`, 120, y);
            doc.text(`Date: ${new Date(contract.contractorSignedAt!).toLocaleDateString()}`, 120, y + 5);
        }

        doc.save(`${contract.title.replace(/\s+/g, '_')}_${contract.id.substring(0, 8)}.pdf`);
        toast.success("PDF Downloaded");
    };

    const canSign = (contract: Contract) => {
        const isClient = currentUser.role === 'client' || currentUser.role === 'admin';
        const isTalent = currentUser.role === 'talent' || currentUser.role === 'agency';

        if (contract.status === 'active') return false;

        if (isClient && !contract.clientSignature) return true;
        if (isTalent && !contract.contractorSignature) return true;

        return false;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-xl">
                                    <ScrollText className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1a1a2e]">
                                    {contract ? contract.title : 'New Contract'}
                                </h3>
                                {contract && (
                                    <Button variant="outline" size="sm" onClick={handleDownload} className="ml-4 rounded-xl">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </Button>
                                )}
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {!contract ? (
                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-700">Select Template</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {templates.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setType(t.id as any)}
                                                className={`p-6 rounded-2xl border-2 transition-all text-left group ${type === t.id
                                                    ? 'border-blue-500 bg-blue-50/50'
                                                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className={`p-2 rounded-lg ${type === t.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50'}`}>
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-gray-900">{t.name}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="pt-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Contract Content</label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={12}
                                            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="prose prose-sm max-w-none">
                                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 font-serif leading-relaxed whitespace-pre-wrap">
                                        {contract.content}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-gray-500">
                                        <div className="border p-3 rounded">
                                            <p className="font-semibold mb-1">Client Signature</p>
                                            {contract?.clientSignature ? (
                                                <div className="text-green-600 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Signed: {contract.clientSignature}
                                                </div>
                                            ) : (
                                                <span className="text-amber-600">Pending</span>
                                            )}
                                        </div>
                                        <div className="border p-3 rounded">
                                            <p className="font-semibold mb-1">Talent/Agency Signature</p>
                                            {contract?.contractorSignature ? (
                                                <div className="text-green-600 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Signed: {contract.contractorSignature}
                                                </div>
                                            ) : (
                                                <span className="text-amber-600">Pending</span>
                                            )}
                                        </div>
                                    </div>

                                    {contract.status === 'active' && (
                                        <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                                                    <Signature className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-green-800">Digitally Signed & Active</p>
                                                    <p className="text-xs text-green-600">Finalized on {new Date(contract.updatedAt || contract.createdAt!).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-green-800 uppercase tracking-widest">Status</p>
                                                <p className="font-serif italic font-medium text-green-900">Enforceable Agreement</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/30">
                            <Button variant="outline" onClick={onClose} className="rounded-xl px-6">
                                Close
                            </Button>
                            {!contract && (
                                <Button
                                    onClick={handleCreateContract}
                                    disabled={createMutation.isPending}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8"
                                >
                                    {createMutation.isPending ? 'Generating...' : 'Generate Contract'}
                                </Button>
                            )}
                            {contract && canSign(contract) && (
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Type full name to sign"
                                        value={signerName}
                                        onChange={(e) => setSignerName(e.target.value)}
                                        className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                    <Button
                                        onClick={handleSignContract}
                                        disabled={signMutation.isPending || !signerName.trim()}
                                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-8"
                                    >
                                        {signMutation.isPending ? 'Signing...' : 'Sign Agreement'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}


export function ContractsList({ projectId, currentUser }: ContractsListProps) {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    // const { toast } = useToast(); // Removed as sonner is used in CustomContractModal

    useEffect(() => {
        loadContracts();
    }, [projectId]);

    const loadContracts = async () => {
        try {
            const data = await talentXApi.Legal.Contracts.listByProject(projectId);
            setContracts(data);
        } catch (error) {
            console.error("Failed to load contracts", error);
            toast.error("Failed to load contracts", { description: (error as Error).message });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <Badge className="bg-green-500">Active</Badge>;
            case 'pending_signature': return <Badge variant="secondary">Pending Signature</Badge>;
            case 'draft': return <Badge variant="outline">Draft</Badge>;
            default: return <Badge variant="destructive">{status}</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Contracts & Agreements</CardTitle>
                {(currentUser.role === 'client' || currentUser.role === 'admin') && (
                    <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Create New
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {contracts.length === 0 ? (
                        <p className="text-sm text-gray-500">No active contracts for this project.</p>
                    ) : (
                        contracts.map((contract) => (
                            <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{contract.title}</h4>
                                        <p className="text-xs text-gray-500 flex gap-2 mt-1">
                                            <span>Type: {contract.type}</span>
                                            <span>•</span>
                                            <span>Created: {new Date(contract.createdAt!).toLocaleDateString()}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {getStatusBadge(contract.status)}
                                    <Button variant="ghost" size="sm" onClick={() => {
                                        setSelectedContract(contract);
                                        setIsViewModalOpen(true);
                                    }}>
                                        View
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => {
                                        // A quick way to use the download logic from the items
                                        const doc = new jsPDF();
                                        doc.setFontSize(20);
                                        doc.text(contract.title, 20, 20);
                                        doc.setFontSize(10);
                                        const splitText = doc.splitTextToSize(contract.content, 170);
                                        doc.text(splitText, 20, 60);
                                        doc.save(`${contract.title.replace(/\s+/g, '_')}.pdf`);
                                    }}>
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>

            {/* Create Modal */}
            <CustomContractModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                projectId={projectId}
                currentUser={currentUser}
                onSuccess={loadContracts}
            />

            {/* View/Sign Modal */}
            <CustomContractModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                contract={selectedContract}
                projectId={projectId}
                currentUser={currentUser}
                onSuccess={loadContracts}
            />
        </Card>
    );
}
