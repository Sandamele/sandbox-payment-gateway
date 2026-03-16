import type { Prisma } from "../../../generated/prisma/client";
import {
  deleteCacheRepository,
  getCacheRepository,
  setCacheRepository,
} from "./cache.repository";

export const getCacheService = async (key: string) => {
  const cache = await getCacheRepository(key);
  if (!cache) return null;

  if (cache.expiresAt.getTime() < Date.now()) {
    await deleteCacheRepository(key);
    return null;
  }

  return cache.value;
};

export const setCacheService = async (
  key: string,
  value: Prisma.InputJsonValue,
  ttlSeconds: number,
) => {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  return await setCacheRepository(key, value, expiresAt);
};
