import type { Response } from "express";
import type { ApiResponseType } from "./apiResponse.types";

/**
 * Sends a standardized successful API response.
 *
 * Response JSON structure:
 * {
 *   "success": true,
 *   "data": {...},
 *   "error": null,
 *   "meta": {
 *     "requestId": "uuid",
 *     "timeStamp": "ISO date string"
 *   }
 * }
 *
 * @param res - Express response object
 * @param data - Payload returned to the client
 * @param statusCode - HTTP status code (200, 201, etc.)
 *
 * @example
 * successResponse(res, { id: "a7562f41-6fd6-4a38-adc4...", amount: 5000 }, 200)
 */
export default function successResponse<T>(
  res: Response,
  data: T,
  statusCode: number,
): Response<ApiResponseType<T>> {
  const { requestId, timeStamp } = res.locals;
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      requestId,
      timeStamp,
    },
    error: null,
  });
}
