import { prisma } from "../../lib/prisma";

export const createMerchantRepository = async (
  userId: string,
  email: string,
  organizationName: string,
) => {
  return await prisma.merchant.create({
    data: {
      userId,
      email,
      organizationName,
    },
    select: {
      id: true,
      email: true,
      organizationName: true,
      isActive: true,
      createdAt: true,
    },
  });
};

export const findMerchantRepository = async (userId: string) => {
  return await prisma.merchant.findUnique({
    where: { userId },
    select: {
      id: true,
      email: true,
      organizationName: true,
      isActive: true,
      createdAt: true,
    },
  });
};
