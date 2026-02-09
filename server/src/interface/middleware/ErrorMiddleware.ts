import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  errors?: Record<string, string>;
}

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("[ErrorMiddleware]", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || undefined;

  res.status(statusCode).json({
    message,
    errors,
  });
};
