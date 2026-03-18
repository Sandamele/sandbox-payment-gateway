import type { RequestHandler } from "express";
import successResponse from "../../lib/apiResponse/successResponse";
import { createApiKeysService, revokeApiKeyService } from "./apiKeys.services";
import errorResponse from "../../lib/apiResponse/errorResponse";

export const createApiKeys: RequestHandler = async (req, res, next) => {
  const { merchantId } = req.params as { merchantId: string };
  const { environmentType } = req.query as { environmentType: string };
  if (!environmentType) {
    return errorResponse(res, { message: "env is missing" }, 400);
  }
  const { requestId } = res.locals;
  const data = await createApiKeysService(
    merchantId,
    environmentType,
    requestId,
  );
  return successResponse(res, data, 201);
};

export const revokeApiKey: RequestHandler = async (req, res, next) => {
  const { id } = req.params as { id: string };
  const { merchantId } = req.params as { merchantId: string };
  const { requestId } = res.locals;
  const data = await revokeApiKeyService(merchantId, id, requestId);
  return successResponse(res, data, 200);
};
