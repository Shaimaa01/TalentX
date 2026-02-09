'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Task } from '@/shared/types';
import { Button } from "@/shared/components/ui/button";
import { Circle, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    closestCorners,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

interface DroppableColumnProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, children, className }) => {
    const { isOver, setNodeRef } = useDroppable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            className={className}
            style={{
                backgroundColor: isOver ? '#eff6ff' : undefined,
            }}
        >
            {children}
        </div>
    );
};

interface SortableTaskItemProps {
    task: Task;
    index: number;
    onTaskClick: (task: Task) => void;
    draggedTask: string | null;
    updatingTasks: Set<string>;
    columns: readonly { id: string; title: string; icon: any; color: string }[];
    col: { id: string; title: string; icon: any; color: string };
    handleOptimisticUpdate: (taskId: string, newStatus: Task["status"]) => void;
}

const SortableTaskItem: React.FC<SortableTaskItemProps> = ({
    task,
    index,
    onTaskClick,
    draggedTask,
    updatingTasks,
    columns,
    col,
    handleOptimisticUpdate
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onTaskClick(task)}
            className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-move group ${
                draggedTask === task.id
                    ? 'ring-2 ring-blue-400'
                    : ''
            } ${
                updatingTasks.has(task.id)
                    ? 'animate-pulse ring-2 ring-green-400'
                    : ''
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    task.priority === 'high'
                        ? 'bg-red-50 text-red-600'
                        : task.priority === 'medium'
                        ? 'bg-yellow-50 text-yellow-600'
                        : 'bg-blue-50 text-blue-600'
                }`}>
                    {task.priority}
                </span>
            </div>
            <h4 className="font-semibold text-[#1a1a2e] mb-2">{task.title}</h4>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex -space-x-2">
                    <img
                        src={
                            task.assignee?.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                task.assignee?.full_name || 'Unassigned'
                            )}&background=random`
                        }
                        className="w-6 h-6 rounded-full border-2 border-white"
                        alt="Assignee"
                    />
                </div>
                <div className="text-xs text-gray-400 font-medium">
                    {task.due_date
                        ? new Date(task.due_date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                        })
                        : ''}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {col.id !== 'todo' && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs px-3 flex items-center gap-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            const prevColumnIndex =
                                columns.findIndex(c => c.id === col.id) - 1;
                            const prevColumnId = columns[prevColumnIndex]?.id;
                            if (prevColumnId) {
                                console.log('Button click - Moving task:', task.id, 'to:', prevColumnId);
                                handleOptimisticUpdate(task.id, prevColumnId as Task["status"]);
                            }
                        }}
                    >
                        ← {columns[columns.findIndex(c => c.id === col.id) - 1].title}
                    </Button>
                )}
                {col.id !== 'done' && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs px-3 flex items-center gap-1 ml-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                            const nextColumnIndex =
                                columns.findIndex(c => c.id === col.id) + 1;
                            const nextColumnId = columns[nextColumnIndex]?.id;
                            if (nextColumnId) {
                                console.log('Button click - Moving task:', task.id, 'to:', nextColumnId);
                                handleOptimisticUpdate(task.id, nextColumnId as Task["status"]);
                            }
                        }}
                    >
                        {columns[columns.findIndex(c => c.id === col.id) + 1].title} →
                    </Button>
                )}
            </div>
        </motion.div>
    );
};

interface KanbanBoardProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onUpdateStatus: (taskId: string, newStatus: Task["status"]) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskClick, onUpdateStatus }) => {
    const [draggedTask, setDraggedTask] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
    const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());
    const [optimisticTasks, setOptimisticTasks] = useState<Task[]>(tasks);
    const [activeId, setActiveId] = useState<string | null>(null);
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const columns = useMemo(() => ([
        { id: 'todo', title: 'To Do', icon: Circle, color: 'text-gray-500' },
        { id: 'in_progress', title: 'In Progress', icon: Clock, color: 'text-blue-500' },
        { id: 'review', title: 'Review', icon: AlertCircle, color: 'text-yellow-500' },
        { id: 'done', title: 'Done', icon: CheckCircle, color: 'text-green-500' }
    ] as const), []);

    const optimisticTasksByStatus = useMemo(() => {
        const grouped: Record<string, Task[]> = { todo: [], in_progress: [], review: [], done: [] };
        (optimisticTasks || []).forEach(t => {
            (grouped[t.status] ||= []).push(t);
        });
        return grouped;
    }, [optimisticTasks]);

    // Sync optimistic tasks with actual tasks, but preserve optimistic changes
    React.useEffect(() => {
        setOptimisticTasks(prev => {
            // If we have optimistic updates, don't overwrite them
            const hasOptimisticChanges = updatingTasks.size > 0;
            if (!hasOptimisticChanges) {
                return tasks;
            }
            return prev; // Keep current optimistic state
        });
    }, [tasks]);

    const handleOptimisticUpdate = useCallback((taskId: string, newStatus: Task["status"]) => {
        // Update UI immediately
        setOptimisticTasks(prev => 
            prev.map(task => 
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
        
        // Add to updating set for loading state
        setUpdatingTasks(prev => new Set(prev).add(taskId));
        
        // Call actual update
        onUpdateStatus(taskId, newStatus);
        
        // Remove from updating set after successful response (longer delay to account for server round trip)
        setTimeout(() => {
            setUpdatingTasks(prev => {
                const newSet = new Set(prev);
                newSet.delete(taskId);
                return newSet;
            });
        }, 2000);
    }, [onUpdateStatus]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
        setDraggedTask(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;
        if (over) {
            setDragOverColumn(over.id as string);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over) {
            setActiveId(null);
            setDraggedTask(null);
            setDragOverColumn(null);
            return;
        }

        const taskId = active.id as string;
        const overId = over.id as string;
        
        // Check if we're dropping over a column
        const validColumns = ['todo', 'in_progress', 'review', 'done'];
        if (validColumns.includes(overId)) {
            console.log('Dropping task:', taskId, 'to column:', overId);
            handleOptimisticUpdate(taskId, overId as Task["status"]);
        }
        
        setActiveId(null);
        setDraggedTask(null);
        setDragOverColumn(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="grid md:grid-cols-4 gap-6 overflow-x-auto pb-4">
                {columns.map((col) => {
                    const columnTasks = optimisticTasksByStatus[col.id] || [];
                    return (
                        <div key={col.id} className="min-w-[280px]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <col.icon className={`w-5 h-5 ${col.color}`} />
                                    <h3 className="font-bold text-gray-700">{col.title}</h3>
                                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                        {columnTasks.length}
                                    </span>
                                </div>
                            </div>

                            <SortableContext
                                id={col.id}
                                items={columnTasks.map(task => task.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <DroppableColumn
                                    id={col.id}
                                    className={`space-y-3 rounded-lg p-2 ${columnTasks.length > 0 ? 'min-h-[400px]' : ''} transition-colors ${
                                        dragOverColumn === col.id
                                            ? 'bg-blue-50 border-2 border-dashed border-blue-400'
                                            : 'bg-gray-50'
                                    }`}
                                >
                                    {columnTasks.map((task, index) => (
                                        <SortableTaskItem
                                            key={task.id}
                                            task={task}
                                            index={index}
                                            onTaskClick={onTaskClick}
                                            draggedTask={draggedTask}
                                            updatingTasks={updatingTasks}
                                            columns={columns}
                                            col={col}
                                            handleOptimisticUpdate={handleOptimisticUpdate}
                                        />
                                    ))}
                                </DroppableColumn>
                            </SortableContext>
                        </div>
                    );
                })}
            </div>
            
            <DragOverlay>
                {activeId ? (
                    <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-blue-400 opacity-90 cursor-grabbing">
                        <h4 className="font-semibold text-[#1a1a2e]">
                            {optimisticTasks?.find(t => t.id === activeId)?.title}
                        </h4>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default KanbanBoard;
