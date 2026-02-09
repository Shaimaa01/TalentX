import { useState } from 'react';
import { Project, Task, User } from '@/shared/types';
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft,DollarSign, CheckCircle,AlertCircle, Plus, LayoutGrid, List, Star,  X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { talentXApi } from '@/shared/api/talentXApi';
import { toast } from 'sonner';
import TaskModal from './TaskModal';
import TaskListView from './TaskListView';
import { DisputeBanner, DisputeModal } from '../Legal/DisputeComponents';
import { WorkVerificationWidgets } from './WorkVerificationWidgets';
import { ProjectOverviewTab } from './ProjectOverviewTab';
import { ProjectKanbanBoard } from './ProjectKanbanBoard';
import { ProjectTeamTab } from './ProjectTeamTab';
import { ProjectDetailTab, TaskCreatePayload, TaskFormData, TaskUpdatePayload } from '@/entities/project/model/types';
import { ProjectFilesTab } from './ProjectFilesTab';
import { ProjectSRSTab } from './ProjectSRSTab';
import { ProjectDesignTab } from './ProjectDesignTab';
import { ProjectWhiteboardTab } from './ProjectWhiteboardTab';
import { ProjectContractsTab } from './ProjectContractsTab';
import { ViewModeToggle } from "@/shared/components/ui/view-mode-toggle";

interface ProjectDetailProps {
    user: User;
    project: Project;
    onBack: () => void;
}

export default function ProjectDetail({ user, project, onBack }: ProjectDetailProps) {
    const [activeTab, setActiveTab] = useState<ProjectDetailTab>('overview');
    const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskViewMode, setTaskViewMode] = useState<'board' | 'list'>('board');
    const queryClient = useQueryClient();
    const tabs: ProjectDetailTab[] = [
    'overview', 'work', 'tasks', 'team', 'files', 
    'srs', 'design', 'whiteboard', 'contracts'
    ];

    const isClientOrAdmin = user.role === 'client' || user.role === 'admin';
    const canManageTasks =
        user.role === 'client' || user.role === 'admin' || user.role === 'agency';

    // Combine team members with the assigned entity if applicable for task assignment
    const assignableMembers = [
        ...(project.team_members || []),
        ...(project.assigned_to ? [{
            id: project.assigned_to.userId || project.assigned_to.id,
            full_name: project.assigned_to.name,
            role: project.assigned_to.type,
            avatar_url: project.assigned_to.image_url
        }] : [])
    ].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i); // specific deduplication

    // Tasks Query
    const { data: tasks, isLoading: tasksLoading } = useQuery({
        queryKey: ['tasks', project.id],
        queryFn: async () => talentXApi.entities.Task.filter({ project_id: project.id }),
    });

    // Update Task (Status only - for Kanban drag/drop or quick actions)
    const updateTaskStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: Task['status'] }) => {
            return await talentXApi.entities.Task.update(id, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
            toast.success('Task updated');
        },
    });

    // Detailed Update Task Mutation
    const updateTaskMutation = useMutation({
      mutationFn: async (updatedTask: TaskFormData & { id: string }) => {
        const { id, assigneeId, ...data } = updatedTask;
        const payload: TaskUpdatePayload = {
            title: data.title,
            description: data.description,
            priority: data.priority,
            due_date: data.due_date,
            assignee_id: assigneeId || null,
            status: data.status,
        };
        return await talentXApi.entities.Task.update(id, payload);
    },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
            setIsTaskModalOpen(false);
            setSelectedTask(null);
            toast.success('Task updated successfully');
        },
        onError: () => {
            toast.error('Failed to update task');
        },
    });

    // Update Project Mutation
    const updateProjectMutation = useMutation({
        mutationFn: async (data: Partial<Project>) => {
            return await talentXApi.entities.Project.update(project.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project updated');
        },
        onError: () => {
            toast.error('Failed to update project');
        },
    });

    // Create Task Mutation
    const createTaskMutation = useMutation({
    mutationFn: async (newTask: TaskFormData) => {
        const payload: TaskCreatePayload = {
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            due_date: newTask.due_date,
            assignee_id: newTask.assigneeId || null,
            project_id: project.id,
            status: newTask.status || 'todo',
        };
        return await talentXApi.entities.Task.create(payload);
    },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
            setIsTaskModalOpen(false);
            toast.success('Task created successfully');
        },
        onError: () => {
            toast.error('Failed to create task');
        },
    });

    // Delete Task Mutation
    const deleteTaskMutation = useMutation({
        mutationFn: async (id: string) => {
            return await talentXApi.entities.Task.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
            setIsTaskModalOpen(false);
            setSelectedTask(null);
            toast.success('Task deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete task');
        },
    });

    const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');

    const handleTaskSave = (data: TaskFormData) => {
    if (selectedTask) {
        updateTaskMutation.mutate({ ...data, id: selectedTask.id });
    } else {
        createTaskMutation.mutate(data);
    }
    };

    const completeProjectMutation = useMutation({
        mutationFn: async ({ rating, review }: { rating: number; review: string }) => {
            return await talentXApi.entities.Project.complete(project.id, { rating, review });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setIsCompletionModalOpen(false);
            toast.success('Project marked as completed!');
        },
        onError: () => {
            toast.error('Failed to complete project');
        },
    });

    const releasePaymentMutation = useMutation({
        mutationFn: async () => {
            return await talentXApi.entities.Project.releasePayment(project.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Payment released successfully!');
        },
        onError: () => {
            toast.error('Failed to release payment');
        },
    });

    const handleCompleteProject = () => {
        if (!review || review.length < 10) {
            toast.error('Please provide a review (at least 10 characters)');
            return;
        }
        completeProjectMutation.mutate({ rating, review });
    };

    const handleReleasePayment = () => {
        if (confirm('Are you sure you want to release payment for this project?')) {
            releasePaymentMutation.mutate();
        }
    };

    return (
        <div className="space-y-8">
            <DisputeBanner projectId={project.id} isFrozen={project.paymentStatus === 'frozen'} />
            <DisputeModal
                isOpen={isDisputeModalOpen}
                onClose={() => setIsDisputeModalOpen(false)}
                projectId={project.id}
                onDisputeCreated={() => queryClient.invalidateQueries({ queryKey: ['projects'] })}
            />
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="rounded-full hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-black">{project.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                    project.status === 'active'
                                        ? 'bg-green-500'
                                        : project.status === 'completed'
                                          ? 'bg-blue-500'
                                          : 'bg-yellow-500'
                                }`}
                            />
                            <span className="capitalize">{project.status.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>Started {new Date(project.start_date).toLocaleDateString()}</span>
                            {project.paymentStatus === 'released' && (
                                <Badge className="bg-green-50 text-green-700 ml-2 border-green-100">
                                    PAYMENT RELEASED
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {user.role === 'client' && project.status === 'active' && (
                        <Button
                            onClick={() => setIsCompletionModalOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" /> Complete Project
                        </Button>
                    )}
                    {user.role === 'admin' &&
                        project.status === 'completed' &&
                        project.paymentStatus !== 'released' && (
                            <Button
                                onClick={handleReleasePayment}
                                disabled={releasePaymentMutation.isPending}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                            >
                                <DollarSign className="w-4 h-4 mr-2" /> Release Payment
                            </Button>
                        )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                        title="Report Issue"
                        onClick={() => setIsDisputeModalOpen(true)}
                    >
                        <AlertCircle className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 flex justify-between items-end">
                <nav className="flex gap-8 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-medium capitalize transition-colors relative whitespace-nowrap cursor-pointer ${activeTab === tab ? 'text-[#204ecf]' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'srs' ? 'SRS' : tab === 'work' ? 'Work & Billing' : tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#204ecf]"
                                />
                            )}
                        </button>
                    ))}
                </nav>
                {activeTab === 'tasks' && (
                    <div className="mb-2 flex items-center gap-3">
                        <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
                            <ViewModeToggle
                            modes={[
                            { id: "board" as const, icon: LayoutGrid, label: "Board" },
                            { id: "list" as const, icon: List, label: "List" },
                            ]}
                            activeMode={taskViewMode}
                            onChange={setTaskViewMode}
                        />
                        </div>
                        {canManageTasks && (
                            <Button
                                onClick={() => setIsTaskModalOpen(true)}
                                className="bg-[#204ecf] hover:bg-[#1a3da8] text-white size-sm h-8 text-xs"
                            >
                                <Plus className="w-3 h-3 mr-1.5" /> Add Task
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'overview' && <ProjectOverviewTab project={project}  isClientOrAdmin={isClientOrAdmin} />}
                {activeTab === 'tasks' && (
                    <div className="space-y-6">
                        {taskViewMode === 'board' ? <ProjectKanbanBoard tasks={tasks} setSelectedTask={setSelectedTask} setIsTaskModalOpen={setIsTaskModalOpen} updateTaskStatusMutation={updateTaskStatusMutation} /> : <TaskListView tasks={tasks || []} onTaskClick={(task) => { setSelectedTask(task); setIsTaskModalOpen(true); }} />}
                    </div>
                )}
                {activeTab === 'team' && <ProjectTeamTab project={project} setActiveTab={setActiveTab} isClientOrAdmin={isClientOrAdmin} />}
                {activeTab === 'files' && <ProjectFilesTab />}
                {activeTab === 'srs' && <ProjectSRSTab isClientOrAdmin={isClientOrAdmin} project={project} updateProjectMutation={updateProjectMutation} />}
                {activeTab === 'design' && <ProjectDesignTab project={project} isClientOrAdmin={isClientOrAdmin} />}
                {activeTab === 'whiteboard' && <ProjectWhiteboardTab project={project} isClientOrAdmin={isClientOrAdmin} updateProjectMutation={updateProjectMutation}/>}
                {activeTab === 'work' && <WorkVerificationWidgets projectId={project.id} currentUser={user} />}
                {activeTab === 'contracts' && <ProjectContractsTab projectId={project.id} user={user} />}
            </motion.div>

            {/* Task Modal */}
            {isTaskModalOpen && (
                <TaskModal
                    task={selectedTask}
                    user={user}
                    teamMembers={assignableMembers}
                    onClose={() => {
                        setIsTaskModalOpen(false);
                        setSelectedTask(null);
                    }}
                    onSave={handleTaskSave}
                    onDelete={(id) => deleteTaskMutation.mutate(id)}
                    isSaving={
                        createTaskMutation.isPending ||
                        updateTaskMutation.isPending ||
                        deleteTaskMutation.isPending
                    }
                    readOnly={!!selectedTask && !isClientOrAdmin}
                />
            )}

            {/* Project Completion Modal */}
            {isCompletionModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
                    >
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-green-50/50 to-white">
                            <div>
                                <h3 className="text-2xl font-bold text-[#1a1a2e]">
                                    Complete Project
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Share your feedback to complete the engagement
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCompletionModalOpen(false)}
                                className="rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                        <div className="p-8 space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest">
                                    Rate the Experience
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setRating(s)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                                rating >= s
                                                    ? 'bg-yellow-400 text-white scale-110 shadow-lg shadow-yellow-100'
                                                    : 'bg-gray-50 text-gray-300 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Star
                                                className={`w-6 h-6 ${rating >= s ? 'fill-current' : ''}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest">
                                    Client Review
                                </label>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    rows={4}
                                    placeholder="Tell us about the quality of work, communication, and overall outcome..."
                                    className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none text-sm placeholder:text-gray-300"
                                />
                                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">
                                    Minimum 10 characters required
                                </p>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCompletionModalOpen(false)}
                                    className="flex-1 py-6 rounded-2xl font-bold text-gray-600"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCompleteProject}
                                    disabled={completeProjectMutation.isPending}
                                    className="flex-1 py-6 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-200"
                                >
                                    {completeProjectMutation.isPending
                                        ? 'Completing...'
                                        : 'Complete Project'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
