import successResponse from "../../lib/apiResponse/successResponse";
import type { RequestHandler } from "express";
import {
  createPaymentService,
  findPaymentService,
  refundPaymentService,
} from "./payments.services";
import { setCacheService } from "../cache";
import { paymentsLogger } from "../../lib/logger/payments.logger";
const TTL_SECONDS = 86400;

export const createPayment: RequestHandler = async (req, res) => {
  const { currencyCode, amount } = req.body;
  const { merchantId } = res.locals;
  const idempotencyKey = req.headers["x-idempotency-key"] as string;
  const { requestId } = res.locals;
  const payment = await createPaymentService(
    amount,
    currencyCode,
    merchantId,
    requestId,
  );
  await setCacheService(idempotencyKey, payment, TTL_SECONDS).catch((error) =>
    paymentsLogger.error(
      { idempotencyKey, error, requestId },
      "Idempotency cache write failed",
    ),
  );

  return successResponse(res, payment, 201);
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
  const { requestId } = res.locals;
  const payment = await refundPaymentService(id, amount, merchantId, requestId);
  await setCacheService(idempotencyKey, payment, TTL_SECONDS).catch((error) =>
    paymentsLogger.error(
      { idempotencyKey, error , requestId},
      "Idempotency cache write failed",
    ),
  );

  return successResponse(res, payment, 200);
};
