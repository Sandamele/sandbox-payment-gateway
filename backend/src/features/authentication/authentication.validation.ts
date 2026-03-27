import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("email").trim().isEmail().withMessage("Invalid email").normalizeEmail(),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["USER", "ADMIN", "MERCHANT"])
    .withMessage("Role must be USER, MERCHANT or ADMIN"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
];

export const loginValidation = [
  body("email").trim().isEmail().withMessage("Invalid email").normalizeEmail(),

  body("password").trim().notEmpty().withMessage("Password is required"),
];
