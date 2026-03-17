import { AppError } from "../../errors/appError";
import {
  createMerchantRepository,
  findMerchantRepository,
} from "./merchants.repository";

export const createMerchantService = async (
  userId: string,
  email: string,
  organizationName: string,
) => {
  const merchantExist = await findMerchantRepository(userId);
  if (merchantExist) {
    throw new AppError("Merchant exist already", 400, "MERCHANT_EXIST");
  }
  const merchant = await createMerchantRepository(
    userId,
    email,
    organizationName,
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
