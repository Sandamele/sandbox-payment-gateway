import { AppError } from "../../errors/appError";
import { hashApiKey } from "../../lib/hashApiKey";

import { findApiKey, updateLastUsed } from "./apiKeyAuth.repository";
const LAST_USED_THROTTLE_MS = 5 * 60 * 1000;
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
  if (!apiKeyExist || !apiKeyExist.isActive) {
    throw new AppError("Invalid API key", 401, "UNAUTHORIZED");
  }
  if (
    !apiKeyExist.lastUsedAt ||
    Date.now() - apiKeyExist.lastUsedAt.getTime() > LAST_USED_THROTTLE_MS
  ) {
    await updateLastUsed(apiKeyExist.id).catch((error) => {
      console.error("lastUsedAt update failed", { id: apiKeyExist.id, error });
    });
  }
  return { merchantId: apiKeyExist.merchantId };
};
