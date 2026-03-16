import { prisma } from "../../shared/lib/prisma";

export const findCurrencyRepository = async (currencyCode: string) => {
  return await prisma.currency.findUnique({ where: { code: currencyCode } });
};
