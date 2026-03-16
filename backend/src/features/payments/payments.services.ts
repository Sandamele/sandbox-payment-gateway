import { convertToCents } from "../../shared/lib/convertToCents";
import {
  createPaymentRepository,
  findAllPaymentsRepository,
  findPaymentRepository,
  processPaymentTransactionRepository,
  processRefundPaymentRepository,
  updateFailedPaymentRepository,
} from "./payments.repository";
import { AppError } from "../../errors/appError";
import { findCurrencyService } from "../currency";
import { getRandomPaymentStatus } from "../../shared/lib/getRandomPaymentStatus";
import { setCacheService } from "../cache";
import type { LedgerType } from "../ledge/ledger.types";
const TTL_SECONDS = 86400;

export const createPaymentService = async (
  amount: number,
  currencyCode: string,
  merchantId: string,
  idempotencyKey: string,
) => {
  const currency = await findCurrencyService(currencyCode);

  if (!currency) {
    throw new AppError("Invalid currency code", 400, "INVALID_CURRENCY_CODE");
  }

  if (!currency.isActive) {
    throw new AppError("Currency code not available", 400, "NOT_AVAILABLE");
  }

  const amountInCents = convertToCents(amount, currency.decimalPlaces);

  const payment = await createPaymentRepository({
    amountInCents: amountInCents,
    currencyCode: currency.code,
    merchantId,
    status: "PENDING",
  });

  // Simulation for interacting with the bank
  const status = getRandomPaymentStatus();

  if (status === "FAILED") {
    const failedPayment = await updateFailedPaymentRepository(
      payment.id,
      "FAILED",
    );
    await setCacheService(idempotencyKey, failedPayment, TTL_SECONDS);
    return failedPayment;
  }
  const ledger = {
    paymentId: payment.id,
    merchantId,
    amount: amountInCents,
    currencyCode: payment.currencyCode,
  };
  const ledgerDebit: LedgerType = {
    ...ledger,
    type: "DEBIT",
    description: "Payment captured from customer",
  };
  const ledgerCredit: LedgerType = {
    ...ledger,
    type: "CREDIT",
    description: "Funds credited to merchant",
  };

  const capturedPayment = await processPaymentTransactionRepository(
    payment.id,
    "CAPTURED",
    ledgerDebit,
    ledgerCredit,
  );
  await setCacheService(idempotencyKey, capturedPayment[0], TTL_SECONDS);
  return capturedPayment[0];
};
export const findAllPaymentsService = async (merchantId: string) => {
  return await findAllPaymentsRepository(merchantId);
};
export const findPaymentService = async (
  paymentId: string,
  merchantId: string,
) => {
  const payment = await findPaymentRepository(paymentId, merchantId);

  if (!payment) {
    throw new AppError("Payment not found", 404, "PAYMENT_NOT_FOUND");
  }

  return payment;
};

export const refundPaymentService = async (
  paymentId: string,
  amount: number,
  merchantId: string,
  idempotencyKey: string,
) => {
  const payment = await findPaymentService(paymentId, merchantId);

  if (payment.status === "REFUNDED") {
    throw new AppError(
      "Payment already refunded",
      400,
      "PAYMENT_REFUNDED_ALREADY",
    );
  }

  if (payment.status !== "CAPTURED") {
    throw new AppError(
      "Refund invalid: Payment status must be 'CAPTURED'",
      400,
      "PAYMENT_NOT_CAPTURED",
    );
  }

  const amountInCents = convertToCents(
    amount,
    payment.currency.decimalPlaces || 0,
  );

  const totalRefundAmountInCents = payment.refundedAmount + amountInCents;
  if (totalRefundAmountInCents > payment.amount) {
    throw new AppError(
      "Refund cannot exceed amount",
      400,
      "REFUND_AMOUNT_EXCEED",
    );
  }
  const ledger = {
    paymentId: payment.id,
    merchantId,
    amount: amountInCents,
    currencyCode: payment.currencyCode,
  };

  const ledgerDebit: LedgerType = {
    ...ledger,
    type: "DEBIT",
    description: "Refund issued to customer",
  };
  const ledgerCredit: LedgerType = {
    ...ledger,
    type: "CREDIT",
    description: "Funds reversed from merchant",
  };
  const refunded = await processRefundPaymentRepository(
    paymentId,
    totalRefundAmountInCents,
    totalRefundAmountInCents === payment.amount ? "REFUNDED" : "CAPTURED",
    ledgerDebit,
    ledgerCredit,
  );
  await setCacheService(idempotencyKey, refunded[0], TTL_SECONDS);
  return refunded[0];
};
