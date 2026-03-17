import type { RequestHandler } from "express";
import { AppError } from "../errors/appError";
import { isUuid } from "../lib/isUuid";
import { getCacheService } from "../features/cache";
import type { Prisma } from "../../generated/prisma/client";
import successResponse from "../lib/apiResponse/successResponse";


export const handleIdempotencyKey: RequestHandler = async (req, res, next) => {
  const idempotencyKey = (
    req.headers["x-idempotency-key"] as string | undefined
  )?.trim();
  if (!idempotencyKey) {
    throw new AppError(
      "x-idempotency-key header is missing",
      400,
      "HEADERS_MISSING",
    );
  }
  if (!isUuid(idempotencyKey)) {
    throw new AppError(
      "x-idempotency-key header must be UUID",
      400,
      "INVALID_FORMAT",
    );
  }
  const cache: Prisma.JsonValue | null = await getCacheService(idempotencyKey);
  if (cache) {
    return successResponse(res, cache, 200);
  }
  req.headers["x-idempotency-key"] = idempotencyKey;
  next();
};
