import successResponse from "../../lib/apiResponse/successResponse";
import type { RouteHandler } from "../../types/routeHandle.types";
import { createApiKeysService, revokeApiKeyService } from "./apiKeys.services";

export const createApiKeys: RouteHandler = async (req, res, next) => {
  const { merchantId } = res.locals;
  const { environment } = req.query as { environment: string };
  const data = await createApiKeysService(merchantId, environment);
  successResponse(res, data, 201);
};

export const revokeApiKey: RouteHandler = async (req, res, next) => {
  const { id } = req.params as { id: string };
  const { merchantId } = res.locals;
  const data = await revokeApiKeyService(merchantId, id);
  successResponse(res, data, 200);
};
