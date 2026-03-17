import { prisma } from "../../lib/prisma";
import type { LedgerType } from "../ledger/ledger.types";
import type { PaymentRepositoryType, StatusType } from "./payments.types";

export const createPaymentRepository = async ({
  amountInCents,
  currencyCode,
  merchantId,
  status,
}: PaymentRepositoryType) => {
  return await prisma.payment.create({
    data: {
      merchantId,
      amount: amountInCents,
      currencyCode,
      status,
    },
    select: {
      id: true,
      amount: true,
      status: true,
      currencyCode: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const processPaymentTransactionRepository = async (
  paymentId: string,
  status: StatusType,
  ledgerDebit: LedgerType,
  ledgerCredit: LedgerType,
) => {
  return await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status },
      select: {
        id: true,
        amount: true,
        status: true,
        currencyCode: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.paymentLedger.create({ data: ledgerDebit }),
    prisma.paymentLedger.create({ data: ledgerCredit }),
  ]);
};

export const findAllPaymentsRepository = async (merchantId: string) => {
  return prisma.payment.findMany({ where: { merchantId } });
};

export const findPaymentRepository = async (id: string, merchantId: string) => {
  return await prisma.payment.findFirst({
    where: { id, merchantId },
    include: {
      currency: {
        select: {
          name: true,
          symbol: true,
          country: true,
          decimalPlaces: true,
        },
      },
    },
  });
};

export const processRefundPaymentRepository = async (
  id: string,
  amountInCents: number,
  status: "REFUNDED" | "CAPTURED",
  ledgerDebit: LedgerType,
  ledgerCredit: LedgerType,
) => {
  return await prisma.$transaction([
    prisma.payment.update({
      where: { id },
      data: {
        refundedAmount: amountInCents,
        status,
        refundedAt: new Date(),
      },
      select: {
        id: true,
        refundedAmount: true,
        status: true,
        currencyCode: true,
        refundedAt: true,
        updatedAt: true,
      },
    }),
    prisma.paymentLedger.create({ data: ledgerDebit }),
    prisma.paymentLedger.create({ data: ledgerCredit }),
  ]);
};

export const updateFailedPaymentRepository = async (
  id: string,
  status: "FAILED",
) => {
  return await prisma.payment.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      amount: true,
      status: true,
      currencyCode: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
