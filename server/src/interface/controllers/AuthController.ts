import { Request, Response } from 'express';
import { RegisterSchema, LoginSchema } from '../../application/dtos/AuthDTO';
import { AuthService } from '../../application/services/AuthService';

export class AuthController {
    constructor(private authService: AuthService) { }

    register = async (req: Request, res: Response) => {
        try {
            const validationResult = RegisterSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    message: "Validation Error",
                    errors: (validationResult.error as any).errors
                });
            }

            const result = await this.authService.register(validationResult.data);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Registration failed" });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const validationResult = LoginSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ message: "Validation Error" });
            }

            const result = await this.authService.login(validationResult.data);

            // Set Cookie
            res.cookie("access_token", result.token, {
                maxAge: 3600000 * 24, // 24h
                httpOnly: true,
                sameSite: "lax",
            });

            res.json({ message: "Login successful", ...result });
        } catch (error: any) {
            res.status(401).json({ message: error.message || "Login failed" });
        }
    };

    me = async (req: Request, res: Response) => {
        // req.user is set by middleware
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            // Fetch fresh user data from DB to ensure roles/permissions are up to date
            const user = await this.authService.getUserById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        } catch (error) {
            res.json(req.user); // Fallback to token data if DB fails
        }
    };
}
