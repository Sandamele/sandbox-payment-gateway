// features/payments/payments.helpers.ts

import type { LedgerType } from "./payments.types";

export const paymentLedgerEntries = (
  paymentId: string,
  merchantId: string,
  amountInCents: number,
  currencyCode: string,
): { ledgerDebit: LedgerType; ledgerCredit: LedgerType } => ({
  ledgerDebit: {
    paymentId,
    merchantId,
    amount: amountInCents,
    currencyCode,
    type: "DEBIT",
    description: "Payment captured from customer",
  },
  ledgerCredit: {
    paymentId,
    merchantId,
    amount: amountInCents,
    currencyCode,
    type: "CREDIT",
    description: "Funds credited to merchant",
  },
});

export const refundLedgerEntries = (
  paymentId: string,
  merchantId: string,
  amountInCents: number,
  currencyCode: string,
): { ledgerDebit: LedgerType; ledgerCredit: LedgerType } => ({
  ledgerDebit: {
    paymentId,
    merchantId,
    amount: amountInCents,
    currencyCode,
    type: "DEBIT",
    description: "Refund issued to customer",
  },
  ledgerCredit: {
    paymentId,
    merchantId,
    amount: amountInCents,
    currencyCode,
    type: "CREDIT",
    description: "Funds reversed from merchant",
  },
});
