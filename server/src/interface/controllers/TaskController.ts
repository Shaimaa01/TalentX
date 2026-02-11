import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../../application/services/TaskService';
import { CreateTaskSchema, UpdateTaskSchema } from '../../application/dtos/TaskDTO';
import { AuthRequest } from '../middleware/AuthMiddleware';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class TaskController {
    private taskService: TaskService;

    constructor({ taskService }: { taskService: TaskService }) {
        this.taskService = taskService;
    }

    createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const validation = CreateTaskSchema.safeParse(req.body);
            if (!validation.success) {
                return next(new ErrorApp("Validation Error", 400, JSON.stringify(validation.error.issues)));
            }
            const task = await this.taskService.createTask(validation.data);
            res.status(201).json(task);
        } catch (error: any) {
            next(error);
        }
    };

    listTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const project_id = req.query.project_id as string | undefined;
            const tasks = await this.taskService.listTasks(project_id);
            res.json(tasks);
        } catch (error: any) {
            next(error);
        }
    };

    updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const validation = UpdateTaskSchema.safeParse(req.body);
            if (!validation.success) {
                return next(new ErrorApp("Validation Error", 400, JSON.stringify(validation.error.issues)));
            }
            const task = await this.taskService.updateTask(req.params.id, validation.data);
            res.json(task);
        } catch (error: any) {
            next(error);
        }
    };

    deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await this.taskService.deleteTask(req.params.id);
            res.json({ message: 'Task deleted successfully' });
        } catch (error: any) {
            next(error);
        }
    };
}
