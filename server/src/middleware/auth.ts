import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export type user = {
  id: string;
  email: string;
  role: string;
};

export class JWTService {
  //Generate Token for user
  static generateToken(userInformation: user) {
    return jwt.sign(userInformation, JWT_SECRET);
  }

  //Verify the Token for controller
  static decodeToken(Token: any): Promise<user> | any {
    return jwt.verify(Token, JWT_SECRET);
  }

  //Extract the cookie
  static extractToken(req: any) {
    // Changed to match the name used in authController
    const token = req.cookies.access_token;
    if (token) {
      return token;
    }

    // Check Authorization header for Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      return req.headers.authorization.split(" ")[1];
    }

    return null;
  }
}

export const authenticateToken = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    //Extract the token from user cookie
    const authToken = JWTService.extractToken(req);
    //verify the user token
    const token = JWTService.decodeToken(authToken);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
        code: "NO_TOKEN",
      });
    }

    // Assign user data to request object for use in controllers
    req.user = token as any;

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      code: "INVALID_TOKEN",
      error: error.message,
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = JWTService.extractToken(req);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRole: any = jwt.decode(token);

    if (!userRole || !userRole.role || !roles.includes(userRole.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};
