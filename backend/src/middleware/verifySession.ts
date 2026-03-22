import type { RequestHandler } from "express";
import { auth } from "../lib/auth";
import { isAPIError } from "better-auth/api";
import errorResponse from "../lib/apiResponse/errorResponse";
import { AppError } from "../errors/appError";

export const verifySession: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies["__Secure-tokens"];
    if (!token) {
      throw new AppError("No session token", 401, "NO_SESSION_TOKEN");
    }
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      throw new AppError("Session Expired", 401, "SESSION_EXPIRED");
    }
    res.locals.user = session.user;
    next();
  } catch (error) {
    if (isAPIError(error)) {
      return errorResponse(res, error.body, error.statusCode);
    }
    next(error);
  }
};
