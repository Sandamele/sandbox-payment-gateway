import type { RouteHandler } from "../../types/routeHandle.types";
import { apiKeyAuthService } from "./apiKeyAuth.services";

export const apiKeyAuth: RouteHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const apiKey = await apiKeyAuthService(authHeader);
  res.locals.merchantId = apiKey.merchantId;
  next();
};
