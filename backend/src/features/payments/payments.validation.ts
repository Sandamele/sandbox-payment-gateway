import { body } from "express-validator";

export const validateCreatePayment = [
  body("amount")
    .notEmpty()
    .withMessage("amount required")
    .isFloat({ gt: 0, max: 999999.99 })
    .withMessage("amount must be between 0.01 and 999,999.99"),
  body("currencyCode").notEmpty().withMessage("currencyCode is required"),
];

export const validateRefund = [
  body("amount")
    .notEmpty()
    .withMessage("amount required")
    .isFloat({ gt: 0, max: 999999.99 })
    .withMessage("amount must be between 0.01 and 999,999.99"),
];
