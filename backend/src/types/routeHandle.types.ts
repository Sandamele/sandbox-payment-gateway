// types/express.d.ts
import type { Request, Response, NextFunction } from "express";

export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;