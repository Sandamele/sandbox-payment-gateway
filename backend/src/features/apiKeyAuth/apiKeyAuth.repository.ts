import { prisma } from "../../lib/prisma";

export const findApiKeyRepository = async (apiKey: string) => {
  return await prisma.apiKeys.findUnique({ where: { apiKey } });
};

export const updateLastUsed = async (id: string) => {
  return await prisma.apiKeys.update({
    where: { id },
    data: {
      lastUsedAt: new Date(),
    },
  });
};
