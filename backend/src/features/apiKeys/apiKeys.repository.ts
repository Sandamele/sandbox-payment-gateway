import { prisma } from "../../lib/prisma";

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
  return await prisma.apiKeys.update({
    data: {
      isActive: false,
      revokedAt: new Date(),
    },
    where: { id },
  });
};

export const findMerchantByIdRepository = async (id: string) => {
  return await prisma.merchant.findUnique({ where: { id: id } });
};
