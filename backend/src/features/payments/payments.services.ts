import { convertToCents } from "../../lib/convertToCents";
import {
  createPaymentRepository,
  findPaymentRepository,
  processPaymentTransactionRepository,
  processRefundPaymentRepository,
  updateFailedPaymentRepository,
} from "./payments.repository";
import { AppError } from "../../errors/appError";
import { validateCurrencyService } from "../currency";
import { getRandomPaymentStatus } from "../../lib/getRandomPaymentStatus";

import { paymentsLogger } from "../../lib/logger/payments.logger";
import type { LogDataType } from "../../types/logger.type";
import { paymentLedgerEntries, refundLedgerEntries } from "./payments.helper";

export const createPaymentService = async (
  amount: number,
  currencyCode: string,
  merchantId: string,
  requestId: string,
) => {
  const currency = await validateCurrencyService(currencyCode);
  const amountInCents = convertToCents(amount, currency.decimalPlaces);

  const payment = await createPaymentRepository({
    amountInCents: amountInCents,
    currencyCode: currency.code,
    merchantId,
    status: "PENDING",
  });
  if (payment) {
    const logData: LogDataType = {
      event: "payment.created",
      requestId,
      data: {
        paymentId: payment.id,
        amount: payment.amount,
        status: payment.status,
        currencyCode,
      },
    };
    paymentsLogger.info(logData, "Payment Created");
  }
  // Simulation for interacting with the bank
  const status = getRandomPaymentStatus();

  if (status === "FAILED") {
    const failedPayment = await updateFailedPaymentRepository(
      payment.id,
      "FAILED",
    );
    const logData: LogDataType = {
      event: "payment.failed",
      requestId,
      data: {
        paymentId: failedPayment.id,
        amount: failedPayment.amount,
        currencyCode,
      },
    };
    paymentsLogger.warn(logData, "Payment Failed");
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
  if (capturedPayment.length > 0) {
    const logData: LogDataType = {
      event: "payment.captured",
      requestId,
      data: {
        paymentId: capturedPayment[0].id,
        amount: capturedPayment[0].amount,
        currencyCode,
      },
    };
    paymentsLogger.info(logData, "Payment Captured");
  }
  return capturedPayment[0];
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
  requestId: string,
) => {
  const payment = await validateRefundPayment(paymentId, merchantId);
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
  if (refunded.length > 0) {
    const logData: LogDataType = {
      event:
        refunded[0].status === "CAPTURED"
          ? "payments.refund.partial"
          : "payments.refund.full",
      requestId,
      data: {
        paymentId,
        refundedAmount: refunded[0].refundedAmount,
      },
    };
    paymentsLogger.info(logData, "Payment refunded");
  }
  return refunded[0];
};

const validateRefundPayment = async (paymentId: string, merchantId: string) => {
  const payment = await findPaymentService(paymentId, merchantId);

  if (!payment) {
    throw new AppError("Payment not found", 404, "PAYMENT_NOT_FOUND");
  }

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
