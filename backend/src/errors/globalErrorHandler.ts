import type { NextFunction, Request, Response } from "express";
import type { AppError } from "./appError";
import errorResponse from "../lib/apiResponse/errorResponse";

export default function globalErrorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const error = {
    message: err.message || "Something went wrong. Please try again.",
    stack: err.stack,
    path: req.path,
    method: req.method,
    code: err.code,
  };
  console.error({ error });
  delete error.stack;
  return errorResponse(res, error, err.statusCode || 500);
}
