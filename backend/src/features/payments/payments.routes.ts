import { Router } from "express";
import {
  createPayment,
  findAllPayments,
  findPayment,
  refundPayment,
} from "./payments.controllers";
import { validateCreatePayment, validateRefund } from "./payments.validation";
import validationResponse from "../../configs/middleware/validationRequestError";
import { handleIdempotencyKey } from "../../configs/middleware/handleIdempotencyKey";
const router = Router();

router.get("/", findAllPayments);
router.get("/:id", findPayment);
router.post(
  "/",
  handleIdempotencyKey,
  validateCreatePayment,
  validationResponse,
  createPayment,
);
router.post(
  "/:id/refund",
  handleIdempotencyKey,
  validateRefund,
  validationResponse,
  refundPayment,
);
export default router;
