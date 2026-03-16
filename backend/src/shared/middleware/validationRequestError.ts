import type { NextFunction, Request, Response } from "express";
import { validationResult  } from "express-validator";

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

    const { requestId, timeStamp } = res.locals;

    return res.status(400).json({
      success: false,
      error: formattedErrors,
      data: null,
      meta: {
        requestId,
        timeStamp,
      },
    });
  }
  next();
}
