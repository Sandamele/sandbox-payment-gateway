import { AppError } from "../../errors/appError";
import { generateApiKey } from "../../lib/generateApiKey";
import { hashApiKey } from "../../lib/hashApiKey";
import {
  createApiKeysRepository,
  findMerchantApiKeyRepository,
  revokeApiKeyRepository,
} from "./apiKeys.repository";

export const createApiKeysService = async (
  merchantId: string,
  environment: string,
) => {
  const prefix = environment === "production" ? "sk_prod_" : "sk_dev_";
  const apiKey = `${prefix}${generateApiKey()}`;
  const hashedKey = hashApiKey(apiKey);
  const record = await createApiKeysRepository(merchantId, hashedKey);
  if (!record) {
    throw new AppError("DB returned null", 500, "DB_ERROR");
  }
  return {
    id: record.id,
    key: apiKey,
    createdAt: record.createdAt,
  };
};

export const revokeApiKeyService = async (merchantId: string, id: string) => {
  const apiKeyExist = await findMerchantApiKeyRepository(merchantId, id);
  if (!apiKeyExist) {
    throw new AppError("API Key not found", 404, "NOT_FOUND");
  }

  if (!apiKeyExist.isActive) {
    throw new AppError(
      "API key is already revoked",
      400,
      "KEY_ALREADY_REVOKED",
    );
  }
  const update = await revokeApiKeyRepository(id);
  return {
    id: update.id,
    revoked: !update.isActive,
    revokedAt: update.revokedAt,
  };
};
