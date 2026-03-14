import type { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import type { RouteHandler } from "../types/routeHandle.types";
export const requestMetadata: RouteHandler = (req, res, next) => {
  const requestId = crypto.randomUUID();
  const timeStamp = new Date().toISOString();
  res.locals.requestId = requestId;
  res.locals.timeStamp = timeStamp;
  next();
};
