import { AppError } from "../../errors/appError";
import successResponse from "../../lib/apiResponse/successResponse";
import type { RouteHandler } from "../../types/routeHandle.types";
import { createApiKeysService, revokeApiKeyService } from "./apiKeys.services";

export const createApiKeys: RouteHandler = async (req, res, next) => {
  try {
    const { merchantId } = req.params as { merchantId: string };
    const { environment } = req.query as { environment: string };
    if (!merchantId) {
      return next(new AppError("Merchant ID is required", 400, "MISSING_ID"));
    }
    const data = await createApiKeysService(merchantId, environment);

    successResponse(res, data, 201);
  } catch (error) {
    next(error);
  }
};

export const revokeApiKey: RouteHandler = async (req, res, next) => {
  try {
    const { merchantId, id } = req.params as { merchantId: string; id: string };
    const data = await revokeApiKeyService(merchantId, id);
    successResponse(res, data, 200);
  } catch (error) {
    next(error);
  }
};
