import { Router } from "express";
import { createMerchant, findMerchant } from "./merchants.controllers";
import { createMerchantValidation } from "./merchants.validation";
import validationResponse from "../../middleware/validationResponse";
const router = Router();

router.get("/", findMerchant);
router.post("/", createMerchantValidation, validationResponse, createMerchant);

export default router;
