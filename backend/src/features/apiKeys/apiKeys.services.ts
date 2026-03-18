import { AppError } from "../../errors/appError";
import { generateApiKey } from "../../lib/generateApiKey";
import { hashApiKey } from "../../lib/hashApiKey";
import { apiKeysLogger } from "../../lib/logger/apiKeys.logger";
import {
  createApiKeysRepository,
  findMerchantApiKeyRepository,
  findMerchantByIdRepository,
  revokeApiKeyRepository,
} from "./apiKeys.repository";

export const createApiKeysService = async (
  merchantId: string,
  environment: string,
  requestId: string,
) => {
  const prefix = environment === "production" ? "sk_prod_" : "sk_dev_";
  const merchantExist = await findMerchantByIdRepository(merchantId);
  if (!merchantExist) {
    throw new AppError("Merchant not found", 404, "NOT_FOUND");
  }
  const apiKey = `${prefix}${generateApiKey()}`;
  const hashedKey = hashApiKey(apiKey);
  const record = await createApiKeysRepository(merchantId, hashedKey);
  apiKeysLogger.info(
    {
      requestId,
      event: "apikey.created",
      data: { keyId: record.id },
    },
    "API Key Created",
  );
  return {
    id: record.id,
    key: apiKey,
    createdAt: record.createdAt,
  };
};

export const revokeApiKeyService = async (
  merchantId: string,
  id: string,
  requestId: string,
) => {
  const apiKeyExist = await findMerchantApiKeyRepository(merchantId, id);
  if (!apiKeyExist || !apiKeyExist.isActive) {
    apiKeysLogger.warn(
      { event: "apikey.invalid", requestId },
      "Invalid API key",
    );
    throw new AppError("Invalid API key", 401, "UNAUTHORIZED");
  }
  const update = await revokeApiKeyRepository(id);
  apiKeysLogger.warn(
    { event: "apikey.revoked", requestId, data: { keyId: update.id } },
    "API Key Revoked",
  );
  return {
    id: update.id,
    revoked: !update.isActive,
    revokedAt: update.revokedAt,
  };
};
