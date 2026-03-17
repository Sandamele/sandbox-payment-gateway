import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import errorResponse from "../lib/apiResponse/errorResponse";

export default function validationResponse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      message: error.msg,
      field: "path" in error ? error.path : undefined, // accessing 'path' to tell the frontend which field failed validation; safe because we're only handling FieldValidationError
    }));

    return errorResponse(res, formattedErrors, 400);
  }
  next();
}
