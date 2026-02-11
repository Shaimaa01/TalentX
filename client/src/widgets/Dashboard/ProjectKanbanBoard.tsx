/* eslint-disable @next/next/no-img-element */
import React, { memo, useMemo } from 'react';
import { Button } from "@/shared/components/ui/button";
import { Task } from "@/shared/types";
import { UseMutationResult } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Circle, Clock, Plus } from "lucide-react";

interface ProjectKanbanBoardProps {
    tasks?: Task[];
    setSelectedTask: (task: Task | null) => void;
    setIsTaskModalOpen: (open: boolean) => void;
    updateTaskStatusMutation: UseMutationResult<
        Task,                                       // Returns Task on success
        Error,                                       // Error type
        { id: string; status: Task['status'] },     // Variables
        unknown                                     // Context
    >;
}

export const ProjectKanbanBoard = memo(({ tasks, setSelectedTask, setIsTaskModalOpen, updateTaskStatusMutation }: ProjectKanbanBoardProps) => {
        const columns = useMemo(() => ([
            { id: 'todo', title: 'To Do', icon: Circle, color: 'text-gray-500' },
            { id: 'in_progress', title: 'In Progress', icon: Clock, color: 'text-blue-500' },
            { id: 'review', title: 'Review', icon: AlertCircle, color: 'text-yellow-500' },
            { id: 'done', title: 'Done', icon: CheckCircle, color: 'text-green-500' }
        ] as const), []);

        const tasksByStatus = useMemo(() => {
            const grouped: Record<string, Task[]> = { todo: [], in_progress: [], review: [], done: [] };
            (tasks || []).forEach(t => {
                (grouped[t.status] ||= []).push(t);
            });
            return grouped;
        }, [tasks]);

        return (
            <div className="grid md:grid-cols-4 gap-6 overflow-x-auto pb-4">
                {columns.map((col) => (
                    <div key={col.id} className="min-w-70">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <col.icon className={`w-5 h-5 ${col.color}`} />
                                <h3 className="font-bold text-gray-700">{col.title}</h3>
                                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {tasksByStatus[col.id]?.length || 0}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }}>
                                <Plus className="w-4 h-4 text-gray-400" />
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {tasksByStatus[col.id]?.map((task) => (
                                <motion.div
                                    key={task.id}
                                    layoutId={task.id}
                                    onClick={() => { setSelectedTask(task); setIsTaskModalOpen(true); }}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                            task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                                                'bg-blue-50 text-blue-600'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-[#1a1a2e] mb-2">{task.title}</h4>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex -space-x-2">
                                            <img
                                                src={task.assignee?.avatar_url || `https://ui-avatars.com/api/?name=${task.assignee?.full_name || 'Unassigned'}&background=random`}
                                                className="w-6 h-6 rounded-full border-2 border-white"
                                                alt={task.assignee?.full_name || 'Unassigned'}
                                            />
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium">
                                            {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {col.id !== 'todo' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-6 text-[10px] px-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateTaskStatusMutation.mutate({ id: task.id, status: columns[columns.findIndex(c => c.id === col.id) - 1].id });
                                                }}
                                            >
                                                Prev
                                            </Button>
                                        )}
                                        {col.id !== 'done' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-6 text-[10px] px-2 ml-auto"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateTaskStatusMutation.mutate({ id: task.id, status: columns[columns.findIndex(c => c.id === col.id) + 1].id });
                                                }}
                                            >
                                                Next
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
);

export default ProjectKanbanBoard;