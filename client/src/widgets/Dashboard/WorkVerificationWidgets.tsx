import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { talentXApi } from '@/shared/api/talentXApi';
import { toast } from 'sonner';
import { Clock, CheckCircle2, XCircle, AlertCircle, Plus, Send } from 'lucide-react';
import { User } from '@/shared/types';

interface WorkVerificationProps {
    projectId: string;
    currentUser: User;
}

export const WorkVerificationWidgets: React.FC<WorkVerificationProps> = ({ projectId, currentUser }) => {
    const [activeTab, setActiveTab] = useState<'time' | 'milestones'>('time');
    const [timeLogs, setTimeLogs] = useState<any[]>([]);
    const [milestones, setMilestones] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [logs, mstones] = await Promise.all([
                talentXApi.WorkVerification.TimeLogs.listByProject(projectId),
                talentXApi.WorkVerification.Milestones.listByProject(projectId)
            ]);
            setTimeLogs(logs);
            setMilestones(mstones);
        } catch (error) {
            console.error('Failed to load work verification data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [projectId]);

    return (
        <div className="space-y-6">
            <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 w-fit">
                <button
                    onClick={() => setActiveTab('time')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'time'
                        ? 'bg-white text-[#204ecf] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Clock className="w-3.5 h-3.5" />
                    Time Tracking
                </button>
                <button
                    onClick={() => setActiveTab('milestones')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'milestones'
                        ? 'bg-white text-[#204ecf] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Milestones
                </button>
            </div>

            {activeTab === 'time' ? (
                <TimeTrackingSection
                    projectId={projectId}
                    currentUser={currentUser}
                    logs={timeLogs}
                    onRefresh={loadData}
                />
            ) : (
                <MilestoneSection
                    projectId={projectId}
                    currentUser={currentUser}
                    milestones={milestones}
                    onRefresh={loadData}
                />
            )}
        </div>
    );
};

const TimeTrackingSection = ({ projectId, currentUser, logs, onRefresh }: any) => {
    const [showLogForm, setShowLogForm] = useState(false);
    const [hours, setHours] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isTalent = currentUser.role === 'talent' || currentUser.role === 'agency';
    const isClient = currentUser.role === 'client' || currentUser.role === 'admin';

    const handleLogTime = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hours || !description) return;

        setIsSubmitting(true);
        try {
            await talentXApi.WorkVerification.TimeLogs.log({
                projectId,
                hours: parseFloat(hours),
                description,
                date
            });
            toast.success('Time logged successfully');
            setHours('');
            setDescription('');
            setShowLogForm(false);
            onRefresh();
        } catch (error) {
            toast.error('Failed to log time');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await talentXApi.WorkVerification.TimeLogs.approve(id);
            toast.success('Time log approved');
            onRefresh();
        } catch (error) {
            toast.error('Failed to approve time log');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await talentXApi.WorkVerification.TimeLogs.reject(id);
            toast.error('Time log rejected');
            onRefresh();
        } catch (error) {
            toast.error('Failed to reject time log');
        }
    };

    return (
        <Card className="rounded-2xl border-[#e2e8f0] shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b flex flex-row items-center justify-between py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Work Logs
                </CardTitle>
                {isTalent && !showLogForm && (
                    <Button size="sm" onClick={() => setShowLogForm(true)} className="bg-[#204ecf] hover:bg-[#1a3da8] text-white rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Log Hours
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-0">
                {showLogForm && (
                    <form onSubmit={handleLogTime} className="p-6 bg-blue-50/30 border-b space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Hours</Label>
                                <Input
                                    type="number"
                                    step="0.5"
                                    placeholder="e.g. 4.5"
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>What did you work on?</Label>
                            <Textarea
                                placeholder="Describe your activity..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="ghost" onClick={() => setShowLogForm(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" disabled={isSubmitting} className="rounded-xl">
                                {isSubmitting ? 'Submitting...' : 'Submit Log'}
                            </Button>
                        </div>
                    </form>
                )}

                <div className="divide-y">
                    {logs.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No time logs found.
                        </div>
                    ) : (
                        logs.map((log: any) => (
                            <div key={log.id} className="p-4 flex items-start justify-between hover:bg-gray-50 transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{log.hours} hrs</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-sm text-gray-600">{new Date(log.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{log.description}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        {log.status === 'pending' && <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">Pending Review</span>}
                                        {log.status === 'approved' && <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Approved</span>}
                                        {log.status === 'rejected' && <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Rejected</span>}
                                        <span className="text-[10px] text-gray-400">by {log.talent?.user?.full_name}</span>
                                    </div>
                                </div>
                                {isClient && log.status === 'pending' && (
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleApprove(log.id)} className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleReject(log.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
                                            <XCircle className="w-5 h-5" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const MilestoneSection = ({ projectId, currentUser, milestones, onRefresh }: any) => {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isClient = currentUser.role === 'client' || currentUser.role === 'admin';
    const isTalent = currentUser.role === 'talent' || currentUser.role === 'agency';

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await talentXApi.WorkVerification.Milestones.create({
                projectId,
                title,
                description,
                amount: parseFloat(amount)
            });
            toast.success('Milestone created');
            setTitle('');
            setAmount('');
            setDescription('');
            setShowForm(false);
            onRefresh();
        } catch (error) {
            toast.error('Failed to create milestone');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRequestApproval = async (id: string) => {
        try {
            await talentXApi.WorkVerification.Milestones.requestApproval(id);
            toast.success('Approval requested');
            onRefresh();
        } catch (error) {
            toast.error('Request failed');
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await talentXApi.WorkVerification.Milestones.approve(id);
            toast.success('Milestone approved & funds marked for release');
            onRefresh();
        } catch (error) {
            toast.error('Approval failed');
        }
    };

    return (
        <Card className="rounded-2xl border-[#e2e8f0] shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b flex flex-row items-center justify-between py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Payment Milestones
                </CardTitle>
                {isClient && !showForm && (
                    <Button size="sm" onClick={() => setShowForm(true)} className="bg-[#204ecf] hover:bg-[#1a3da8] text-white rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Milestone
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-0">
                {showForm && (
                    <form onSubmit={handleCreate} className="p-6 bg-green-50/30 border-b space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Milestone Title</Label>
                                <Input
                                    placeholder="e.g. MVP Launch"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Amount ($)</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Deliverables description</Label>
                            <Textarea
                                placeholder="What needs to be finished?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="ghost" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" disabled={isSubmitting} className="rounded-xl">
                                Create Milestone
                            </Button>
                        </div>
                    </form>
                )}

                <div className="divide-y">
                    {milestones.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No milestones defined yet.
                        </div>
                    ) : (
                        milestones.map((m: any) => (
                            <div key={m.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-800">{m.title}</h4>
                                    <span className="font-bold text-lg text-blue-700">${m.amount.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">{m.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {m.status === 'pending' && <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg border font-medium">Draft</span>}
                                        {m.status === 'requested' && <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg border border-blue-200 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Approval Requested</span>}
                                        {m.status === 'approved' && <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-lg border border-green-200 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Approved</span>}
                                    </div>

                                    {isTalent && m.status === 'pending' && (
                                        <Button size="sm" variant="outline" onClick={() => handleRequestApproval(m.id)} className="rounded-xl">
                                            <Send className="w-3.5 h-3.5 mr-2" />
                                            Submit for Approval
                                        </Button>
                                    )}

                                    {isClient && m.status === 'requested' && (
                                        <Button size="sm" onClick={() => handleApprove(m.id)} className="rounded-xl bg-green-600 hover:bg-green-700">
                                            Approve & Release Funds
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
