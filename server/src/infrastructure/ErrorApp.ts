import { Request, Response, NextFunction } from "express";

export class ErrorApp extends Error {
  constructor(
    public readonly message: string = "internal error",
    public readonly StatusCode: number = 500,
    public readonly help: string = "there is an internal error pls try again latter or call tha support",
  ) {
    super(message);
    this.StatusCode = StatusCode;
    this.help = help;
  }
}

export const ErrorHandler = (
  error: ErrorApp | any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = error.StatusCode || 500;
  return res.status(status).json({
    success: false,
    status: status,
    message: error.message || "internal error",
    help:
      error.help ||
      "try again latter or call support if that's not fist time facing this error message",
  });
};
