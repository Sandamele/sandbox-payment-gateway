import type { NextFunction, Request, Response } from "express";
import { AppError } from "./appError";
import errorResponse from "../lib/apiResponse/errorResponse";

export default function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    const error = {
      message: err.message,
      code: err.code,
    };
    console.error({ error });
    return errorResponse(res, error, err.statusCode);
  }
  console.error(err);
  return errorResponse(
    res,
    {
      message: "Something went wrong. Please try again.",
      code: "INTERNAL_SERVER_ERROR",
    },
    500,
  );
}
