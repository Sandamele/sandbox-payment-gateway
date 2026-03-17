import { AppError } from "../../errors/appError";
import { findCurrencyRepository } from "./currency.repository";

export const findCurrencyService = async (currencyCode: string) => {
  return await findCurrencyRepository(currencyCode);
};

export const validateCurrencyService = async (currencyCode: string) => {
  const currency = await findCurrencyService(currencyCode);

  if (!currency) {
    throw new AppError("Invalid currency code", 400, "INVALID_CURRENCY_CODE");
  }

  if (!currency.isActive) {
    throw new AppError("Currency code not available", 400, "NOT_AVAILABLE");
  }
  return currency;
};