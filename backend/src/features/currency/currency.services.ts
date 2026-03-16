import { findCurrencyRepository } from "./currency.repository";

export const findCurrencyService = async (currencyCode: string) => {
  return await findCurrencyRepository(currencyCode);
};
