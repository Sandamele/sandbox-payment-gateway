import { prisma } from "../../shared/lib/prisma";
import type { LedgerType } from "./ledger.types";

export const createLedgerRepository = async (ledger: LedgerType) => {
  return await prisma.paymentLedger.create({ data: ledger });
};
