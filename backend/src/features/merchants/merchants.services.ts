import { AppError } from "../../errors/appError";
import { merchantsLogger } from "../../lib/logger";
import {
  createMerchantRepository,
  findMerchantRepository,
} from "./merchants.repository";

export const createMerchantService = async (
  userId: string,
  email: string,
  organizationName: string,
  requestId: string,
) => {
  const merchantExist = await findMerchantRepository(userId);
  if (merchantExist) {
    merchantsLogger.warn({ event: "merchant.duplicate" }, "Merchant Duplicate");
    throw new AppError("Merchant exist already", 400, "MERCHANT_EXIST");
  }
  const merchant = await createMerchantRepository(
    userId,
    email,
    organizationName,
  );
  merchantsLogger.info(
    { event: "merchant.created", requestId },
    "Merchant created",
  );
  return merchant;
};

export const findMerchantService = async (userId: string) => {
  const merchant = await findMerchantRepository(userId);
  if (!merchant) {
    throw new AppError("Merchant not found", 404, "MERCHANT_NOT_FOUND");
  }

  return merchant;
};
