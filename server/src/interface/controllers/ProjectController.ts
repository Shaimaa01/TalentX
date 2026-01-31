import { Request, Response } from 'express';
import { ProjectService } from '../../application/services/ProjectService';
import { CreateProjectSchema, UpdateProjectSchema, RecordPaymentSchema, CompleteProjectSchema, ReleasePaymentSchema } from '../../application/dtos/ProjectDTO';
import { AuthRequest } from '../middleware/AuthMiddleware';

export class ProjectController {
    private projectService: ProjectService;

    constructor({ projectService }: { projectService: ProjectService }) {
        this.projectService = projectService;
    }

    /**
     * @swagger
     * /api/projects:
     *   post:
     *     summary: Create a new project
     *     tags: [Projects]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateProjectDTO'
     *     responses:
     *       201:
     *         description: Project created
     */
    createProject = async (req: AuthRequest, res: Response) => {
        try {
            // Augment with user info if missing
            const body = {
                ...req.body,
                clientId: req.body.clientId || req.user?.id,
                client_email: req.body.client_email || req.user?.email
            };

            const validation = CreateProjectSchema.safeParse(body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }

            const project = await this.projectService.createProject(validation.data);
            res.status(201).json(project);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error creating project' });
        }
    };

    /**
     * @swagger
     * /api/projects:
     *   get:
     *     summary: List projects for current user
     *     tags: [Projects]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of projects
     */
    listProjects = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const role = req.user!.role;
            const filters = req.query; // e.g. { talentId: '...', status: 'completed' }
            const projects = await this.projectService.listProjects(userId, role, filters);
            res.json(projects);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error listing projects' });
        }
    };

    /**
     * @swagger
     * /api/projects/{id}:
     *   get:
     *     summary: Get project by ID
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Project information
     *       404:
     *         description: Project not found
     */
    getProject = async (req: Request, res: Response) => {
        try {
            const project = await this.projectService.getProjectById(req.params.id);
            res.json(project);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Project not found' });
        }
    };

    /**
     * @swagger
     * /api/projects/{id}:
     *   put:
     *     summary: Update project
     *     tags: [Projects]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateProjectDTO'
     *     responses:
     *       200:
     *         description: Project updated
     */
    updateProject = async (req: AuthRequest, res: Response) => {
        try {
            const validation = UpdateProjectSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }
            const project = await this.projectService.updateProject(req.user!.id, req.params.id, validation.data);
            res.json(project);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error updating project' });
        }
    };

    /**
     * @swagger
     * /api/projects/{id}:
     *   delete:
     *     summary: Delete project
     *     tags: [Projects]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Project deleted
     */
    deleteProject = async (req: AuthRequest, res: Response) => {
        try {
            await this.projectService.deleteProject(req.user!.id, req.params.id);
            res.json({ message: 'Project deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error deleting project' });
        }
    };

    /**
     * @swagger
     * /api/projects/payments:
     *   post:
     *     summary: Record a payment
     *     tags: [Projects]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RecordPaymentDTO'
     *     responses:
     *       200:
     *         description: Payment recorded
     */
    recordPayment = async (req: AuthRequest, res: Response) => {
        try {
            const validation = RecordPaymentSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }
            const result = await this.projectService.recordPayment(req.user!.id, validation.data);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error recording payment' });
        }
    };

    /**
     * @swagger
     * /api/projects/{id}/complete:
     *   post:
     *     summary: Complete project and provide review
     *     tags: [Projects]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CompleteProjectDTO'
     *     responses:
     *       200:
     *         description: Project completed
     */
    completeProject = async (req: AuthRequest, res: Response) => {
        try {
            const validation = CompleteProjectSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }
            const project = await this.projectService.completeProject(req.user!.id, req.params.id, validation.data);
            res.json(project);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error completing project' });
        }
    };

    /**
     * @swagger
     * /api/projects/{id}/release:
     *   post:
     *     summary: Release payment for project
     *     tags: [Projects]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Payment released
     */
    releasePayment = async (req: AuthRequest, res: Response) => {
        try {
            const project = await this.projectService.releasePayment(req.user!.id, req.params.id);
            res.json(project);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error releasing payment' });
        }
    };
}
