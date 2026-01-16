"use client";

import { LayoutGrid, List } from "lucide-react";
import TaskListView from "./TaskListView";
import KanbanBoard from "./KanbanBoard";
import { useState } from "react";
import { Task } from "@/shared/types";
import { ViewModeToggle } from "@/shared/components/ui/view-mode-toggle";

interface TasksViewProps {
  setSelectedTask: (task: Task | null) => void;
  setIsTaskModalOpen: (open: boolean) => void;
  tasks: Task[];
  onUpdateTask: (id: string, status: Task["status"]) => void;
}

export const TasksView = ({
  setSelectedTask,
  setIsTaskModalOpen,
  tasks,
  onUpdateTask,
}: TasksViewProps) => {
  const [taskViewMode, setTaskViewMode] = useState<"board" | "list">("board");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">My Assigned Tasks</h1>
        <div className="bg-white p-1 rounded-xl flex items-center gap-1 border border-gray-200">
          <ViewModeToggle
            modes={[
              { id: "board" as const, icon: LayoutGrid, label: "Board" },
              { id: "list" as const, icon: List, label: "List" },
            ]}
            activeMode={taskViewMode}
            onChange={setTaskViewMode}
          />
        </div>
      </div>
      {taskViewMode === "board" ? (
        <KanbanBoard
          tasks={tasks || []}
          onTaskClick={(task) => {
            setSelectedTask(task);
            setIsTaskModalOpen(true);
          }}
          onUpdateStatus={onUpdateTask}
        />
      ) : (
        <TaskListView
          tasks={tasks || []}
          onTaskClick={(task) => {
            setSelectedTask(task);
            setIsTaskModalOpen(true);
          }}
        />
      )}
    </div>
  );
};
