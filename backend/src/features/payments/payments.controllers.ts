import successResponse from "../../lib/apiResponse/successResponse";
import type { RequestHandler } from "express";
import {
  createPaymentService,
  findAllPaymentsService,
  findPaymentService,
  refundPaymentService,
} from "./payments.services";
export const createPayment: RequestHandler = async (req, res) => {
  const { currencyCode, amount } = req.body;
  const { merchantId } = res.locals;
  const idempotencyKey = req.headers["x-idempotency-key"] as string;
  const payment = await createPaymentService(
    amount,
    currencyCode,
    merchantId,
    idempotencyKey,
  );
  return successResponse(res, payment, 201);
};

export const findAllPayments: RequestHandler = async (req, res) => {
  const { merchantId } = res.locals;
  const payments = await findAllPaymentsService(merchantId);
  return successResponse(res, payments, 200);
};

export const findPayment: RequestHandler = async (req, res) => {
  const { id } = req.params as { id: string };
  const { merchantId } = res.locals;
  const payment = await findPaymentService(id, merchantId);
  return successResponse(res, payment, 200);
};

export const refundPayment: RequestHandler = async (req, res) => {
  const { id } = req.params as { id: string };
  const { amount } = req.body;
  const { merchantId } = res.locals;
  const idempotencyKey = req.headers["x-idempotency-key"] as string;
  const payment = await refundPaymentService(
    id,
    amount,
    merchantId,
    idempotencyKey,
  );
  return successResponse(res, payment, 200);
};
