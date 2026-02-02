import { Request, Response, NextFunction } from "express";
import { RegisterSchema, LoginSchema } from "../../application/dtos/AuthDTO";
import { AuthService } from "../../application/services/AuthService";
import { ErrorApp } from "../../infrastructure/ErrorApp";

export class AuthController {
  private authService: AuthService;

  constructor({ authService }: { authService: AuthService }) {
    this.authService = authService;
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterDTO'
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Validation error or registration failed
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = RegisterSchema.safeParse(req.body);
      if (!validationResult.success) {
        return next(new ErrorApp("Validation Error", 400, JSON.stringify(validationResult.error.issues)));
      }

      const result = await this.authService.register(validationResult.data);
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login a user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginDTO'
   *     responses:
   *       200:
   *         description: Login successful
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Login failed
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = LoginSchema.safeParse(req.body);
      if (!validationResult.success) {
        return next(new ErrorApp("Validation Error", 400));
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
      next(new ErrorApp(error.message || "Login failed", 401));
    }
  };

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Get current user info
   *     tags: [Auth]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: User information
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  me = async (req: Request, res: Response, next: NextFunction) => {
    // req.user is set by middleware
    if (!req.user) {
      return next(new ErrorApp("Unauthorized", 401));
    }

    try {
      // Fetch fresh user data from DB to ensure roles/permissions are up to date
      const user = await this.authService.getUserById(req.user.id);
      if (!user) {
        return next(new ErrorApp("User not found", 404));
      }
      res.json(user);
    } catch (error) {
      res.json(req.user); // Fallback to token data if DB fails
    }
  };
}
