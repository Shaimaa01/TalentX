export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'pending';

export interface AssignedTo {
    id: string;
    name: string;
    image_url?: string;
    type: 'talent' | 'agency' | 'team';
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    progress: number;
    total_budget: number;
    budget_spent: number;
    start_date?: string;
    end_date?: string;
    next_milestone?: string;
    assigned_to?: AssignedTo;
    clientId: string;
    createdAt: string;
    updatedAt: string;
}

export type ProjectDetailTab = 
    | 'overview' 
    | 'tasks' 
    | 'team' 
    | 'files' 
    | 'srs' 
    | 'design' 
    | 'whiteboard' 
    | 'contracts' 
    | 'work';

// Define the form data type (what comes from your form)
export type TaskFormData = {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    assigneeId?: string | null;
    status?: 'todo' | 'in_progress' | 'review' | 'done';
};

// Define the API payload type (what the API expects)
export type TaskCreatePayload = {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    assignee_id: string | null;
    project_id: string;
    status?: 'todo' | 'in_progress' | 'review' | 'done';
};

export type TaskUpdatePayload = Omit<TaskCreatePayload, 'project_id'>;
