import type { RequestHandler } from "express";
import crypto from "crypto";
export const requestMetadata: RequestHandler = (req, res, next) => {
  const requestId = crypto.randomUUID();
  const timeStamp = new Date().toISOString();
  res.locals.requestId = requestId;
  res.locals.timeStamp = timeStamp;
  next();
};
