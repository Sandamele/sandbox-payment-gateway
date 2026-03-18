import type { NextFunction, Request, Response } from "express";
import { AppError } from "./appError";
import errorResponse from "../lib/apiResponse/errorResponse";
import { globalErrorHandlerLogger } from "../lib/logger";

export default function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { requestId } = res.locals;
  if (err instanceof AppError) {
    const error = {
      message: err.message,
      code: err.code,
    };
    globalErrorHandlerLogger.error({ error, requestId }, "App Error");
    return errorResponse(res, error, err.statusCode);
  }
  globalErrorHandlerLogger.error({ error: err, requestId }, "Global Error");
  return errorResponse(
    res,
    {
      message: "Something went wrong. Please try again.",
      code: "INTERNAL_SERVER_ERROR",
    },
    500,
  );
}
