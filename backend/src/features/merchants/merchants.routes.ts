import { Router } from "express";
import { createMerchant } from "./merchants.controllers";
const router = Router();

router.post("/", createMerchant);

export default router;
