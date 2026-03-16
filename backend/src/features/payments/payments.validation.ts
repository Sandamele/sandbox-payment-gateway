import { body } from "express-validator";

export const validateCreatePayment = [
  body("amount")
    .notEmpty()
    .withMessage("amount required")
    .isFloat({ min: 10 })
    .withMessage("min amount require is 10"),
  body("currencyCode").notEmpty().withMessage("currencyCode is required"),
];

export const validateRefund = [
  body("amount")
    .notEmpty()
    .withMessage("amount required")
    .isFloat({ min: 10 })
    .withMessage("min amount require is 10"),
];
