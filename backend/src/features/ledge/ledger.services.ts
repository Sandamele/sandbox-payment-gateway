import { AppError } from "../../errors/appError";
import { createLedgerRepository } from "./ledger.repository";
import type { LedgerType } from "./ledger.types";

export const createLedgerService = async (
  ledgerDebit: LedgerType,
  ledgerCredit: LedgerType,
) => {
  const ledger = await createLedgerRepository(ledgerDebit, ledgerCredit);
  if (!ledger) {
    throw new AppError("DB returned null", 500, "DB_ERROR");
  }
  return ledger;
};
