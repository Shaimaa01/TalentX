import { Request, Response } from 'express';
import { UserService } from '../../application/services/UserService';
import { UpdateUserSchema } from '../../application/dtos/UserDTO';
import { AuthRequest } from '../middleware/AuthMiddleware';

export class UserController {
    private userService: UserService;

    constructor({ userService }: { userService: UserService }) {
        this.userService = userService;
    }

    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Get all users
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: List of users
     */
    getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error fetching users' });
        }
    };

    /**
     * @swagger
     * /api/users/{id}:
     *   get:
     *     summary: Get user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
	 *           type: string
     *     responses:
     *       200:
     *         description: User information
     *       404:
     *         description: User not found
     */
    getUserById = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            res.json(user);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'User not found' });
        }
    };

    /**
     * @swagger
     * /api/users:
     *   post:
     *     summary: Create a user (Admin)
     *     tags: [Users]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       201:
     *         description: User created
     */
    createUser = async (req: AuthRequest, res: Response) => {
        try {
            const newUser = await this.userService.createUser(req.user!.id, req.body);
            res.status(201).json(newUser);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error creating user' });
        }
    };

    /**
     * @swagger
     * /api/users/{id}:
     *   put:
     *     summary: Update a user
     *     tags: [Users]
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
     *             $ref: '#/components/schemas/UpdateUserDTO'
     *     responses:
     *       200:
     *         description: User updated
     *       400:
     *         description: Validation error
     */
    updateUser = async (req: AuthRequest, res: Response) => {
        try {
            const validationResult = UpdateUserSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ errors: (validationResult.error as any).errors });
            }

            const updatedUser = await this.userService.updateUser(req.user!.id, req.params.id, validationResult.data);
            res.json(updatedUser);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error updating user' });
        }
    };

    /**
     * @swagger
     * /api/users/{id}:
     *   delete:
     *     summary: Delete a user
     *     tags: [Users]
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
     *         description: User deleted
     */
    deleteUser = async (req: AuthRequest, res: Response) => {
        try {
            await this.userService.deleteUser(req.user!.id, req.params.id);
            res.json({ message: 'User deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error deleting user' });
        }
    };
}
