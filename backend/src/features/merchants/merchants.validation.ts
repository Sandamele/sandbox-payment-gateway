import { body } from "express-validator";

export const createMerchantValidation = [
  body("organizationName")
    .notEmpty()
    .withMessage("organizationName is required"),
];
