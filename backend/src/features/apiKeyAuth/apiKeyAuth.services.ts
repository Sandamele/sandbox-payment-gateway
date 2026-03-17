import { AppError } from "../../errors/appError";
import { hashApiKey } from "../../lib/hashApiKey";

import { findApiKey, updateLastUsed } from "./apiKeyAuth.repository";

export const apiKeyAuthService = async (authHeader?: string) => {
  if (!authHeader) {
    throw new AppError("Missing API key", 401, "UNAUTHORIZED");
  }
  const splitAuthHeader = authHeader.split(" ");
  if (
    splitAuthHeader.length !== 2 ||
    String(splitAuthHeader[0]).toLowerCase() !== "bearer"
  ) {
    throw new AppError("Invalid authorization format", 401, "UNAUTHORIZED");
  }
  const token = String(splitAuthHeader[1]);
  const hashedApiKey = hashApiKey(token);
  const apiKeyExist = await findApiKey(hashedApiKey);
  if (!apiKeyExist) {
    throw new AppError("Invalid API key", 401, "UNAUTHORIZED");
  }
  if (!apiKeyExist.isActive) {
    throw new AppError("API key revoked", 401, "API_KEY_REVOKED");
  }

  if (
    !apiKeyExist.lastUsedAt ||
    Date.now() - apiKeyExist.lastUsedAt.getTime() > 300000
  ) {
    await updateLastUsed(apiKeyExist.id);
  }
  return { merchantId: apiKeyExist.merchantId };
};
