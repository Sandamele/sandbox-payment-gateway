import { prisma } from "../../shared/lib/prisma";

export const createApiKeysRepository = async (
  merchantId: string,
  hashedApiKey: string,
) => {
  return await prisma.apiKeys.create({
    data: {
      merchantId,
      apiKey: hashedApiKey,
    },
  });
};

export const findMerchantApiKeyRepository = async (
  merchantId: string,
  id: string,
) => {
  return await prisma.apiKeys.findFirst({ where: { id, merchantId } });
};

export const revokeApiKeyRepository = async (id: string) => {
  const date = new Date();
  return await prisma.apiKeys.update({
    data: {
      isActive: false,
      revokedAt: date.toISOString().toString(),
    },
    where: { id },
  });
};
