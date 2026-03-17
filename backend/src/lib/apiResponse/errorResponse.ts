import type { Response } from "express";
import type { ApiResponseType } from "./apiResponse.types";

/**
 * Sends a standardized error API response.
 *
 * Response JSON structure:
 * {
 *   "success": false,
 *   "data": null,
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Readable message",
 *     "details": {}
 *   },
 *   "meta": {
 *     "requestId": "uuid",
 *     "timeStamp": "ISO date string"
 *   }
 * }
 *
 * @param res - Express response object
 * @param error - Structured error object
 * @param statusCode - HTTP status code (400, 404, 500, etc.)
 *
 * @example
 * errorResponse(res, {
 *   code: "PAYMENT_NOT_FOUND",
 *   message: "Payment does not exist"
 * }, 404)
 *
 */
export default function errorResponse<T>(
  res: Response,
  error: T,
  statusCode: number,
): Response<ApiResponseType> {
  const { requestId, timeStamp } = res.locals;
  return res.status(statusCode).json({
    success: false,
    error,
    data: null,
    meta: {
      requestId,
      timeStamp,
    },
  });
}
