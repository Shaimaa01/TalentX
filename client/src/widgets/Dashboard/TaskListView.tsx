import React, { memo } from 'react';
import { Task } from '@/shared/types';
import { Clock, AlertCircle, CheckCircle, Circle, MoreHorizontal } from 'lucide-react';
import { Button } from "@/shared/components/ui/button";

interface TaskListViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

const statusIcons = {
    todo: { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-50' },
    in_progress: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    review: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    done: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' }
};

const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onTaskClick }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className={`overflow-y-auto ${tasks.length > 0 ? 'max-h-96' : ''}`}>
                {/* Mobile Card View */}
                <div className="sm:hidden">
                    {tasks.map((task) => {
                        const { icon: StatusIcon, color: statusColor, bg: statusBg } = statusIcons[task.status];
                        return (
                            <div
                                key={task.id}
                                onClick={() => onTaskClick(task)}
                                className="p-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-[#1a1a2e] mb-1 line-clamp-2">{task.title}</h3>
                                        <p className="text-xs text-gray-400 line-clamp-2 mb-2">{task.description || 'No description'}</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${statusBg}`}>
                                                <StatusIcon className={`w-3 h-3 ${statusColor}`} />
                                                <span className={`text-xs font-bold capitalize ${statusColor}`}>
                                                    {task.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                                    task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                                                        'bg-blue-50 text-blue-600'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 ml-2">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={task.assignee?.avatar_url || `https://ui-avatars.com/api/?name=${task.assignee?.full_name || 'Unassigned'}&background=random`}
                                            className="w-6 h-6 rounded-full border border-gray-200"
                                            alt="Assignee"
                                        />
                                        <span className="font-medium">{task.assignee?.full_name || 'Unassigned'}</span>
                                    </div>
                                    <span className="whitespace-nowrap">
                                        {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : 'No date'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {tasks.length === 0 && (
                        <div className="px-6 py-8 text-center text-gray-400 text-sm italic">
                            No tasks found in this view.
                        </div>
                    )}
                </div>
                
                {/* Desktop Table View */}
                <div className="hidden sm:block">
                    <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Task</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assignee</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {tasks.map((task) => {
                        const { icon: StatusIcon, color: statusColor, bg: statusBg } = statusIcons[task.status];
                        return (
                            <tr
                                key={task.id}
                                onClick={() => onTaskClick(task)}
                                className="group hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#1a1a2e] group-hover:text-[#204ecf] transition-colors line-clamp-1">{task.title}</span>
                                        <span className="text-xs text-gray-400 line-clamp-1 mt-0.5">{task.description || 'No description'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg ${statusBg}`}>
                                        <StatusIcon className={`w-3.5 h-3.5 ${statusColor}`} />
                                        <span className={`text-xs font-bold capitalize ${statusColor}`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                            task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                                                'bg-blue-50 text-blue-600'
                                        }`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={task.assignee?.avatar_url || `https://ui-avatars.com/api/?name=${task.assignee?.full_name || 'Unassigned'}&background=random`}
                                            className="w-6 h-6 rounded-full border border-gray-200"
                                            alt="Assignee"
                                        />
                                        <span className="text-xs font-medium text-gray-600">{task.assignee?.full_name || 'Unassigned'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                        {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : 'No date'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 group-hover:text-gray-600">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                    {tasks.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-gray-400 text-sm italic">
                                No tasks found in this view.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
                </div>
            </div>
        </div>
    );
};

export default memo(TaskListView);
