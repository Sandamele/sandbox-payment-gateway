import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../shared/lib/prisma";

export const getCacheRepository = async (key: string) => {
  return await prisma.cache.findUnique({ where: { key } });
};

export const setCacheRepository = async (
  key: string,
  value: Prisma.InputJsonValue,
  expiresAt: Date,
) => {
  return await prisma.cache.upsert({
    where: { key },
    update: {
      value,
      expiresAt,
    },
    create: {
      key,
      value,
      expiresAt,
    },
  });
};

export const deleteCacheRepository = async (key: string) => {
  return await prisma.cache.delete({ where: { key } });
};
