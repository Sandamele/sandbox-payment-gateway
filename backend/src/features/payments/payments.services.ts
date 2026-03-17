import { convertToCents } from "../../lib/convertToCents";
import {
  createPaymentRepository,
  findAllPaymentsRepository,
  findPaymentRepository,
  processPaymentTransactionRepository,
  processRefundPaymentRepository,
  updateFailedPaymentRepository,
} from "./payments.repository";
import { AppError } from "../../errors/appError";
import { validateCurrencyService } from "../currency";
import { getRandomPaymentStatus } from "../../lib/getRandomPaymentStatus";
import type { LedgerType } from "../ledger/ledger.types";
import { paymentLedgerEntries, refundLedgerEntries } from "./payment.helper";


export const createPaymentService = async (
  amount: number,
  currencyCode: string,
  merchantId: string,
) => {
  const currency = await validateCurrencyService(currencyCode);
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
    return failedPayment;
  }
  const { ledgerDebit, ledgerCredit } = paymentLedgerEntries(
    payment.id,
    merchantId,
    amountInCents,
    currencyCode,
  );
  const capturedPayment = await processPaymentTransactionRepository(
    payment.id,
    "CAPTURED",
    ledgerDebit,
    ledgerCredit,
  );
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
) => {
  const payment = await validateFindPayment(paymentId, merchantId);
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
  const { ledgerDebit, ledgerCredit } = refundLedgerEntries(
    payment.id,
    merchantId,
    amountInCents,
    payment.currencyCode,
  );
  const refunded = await processRefundPaymentRepository(
    paymentId,
    totalRefundAmountInCents,
    totalRefundAmountInCents === payment.amount ? "REFUNDED" : "CAPTURED",
    ledgerDebit,
    ledgerCredit,
  );
  return refunded[0];
};

const validateFindPayment = async (paymentId: string, merchantId: string) => {
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
  return payment;
};
