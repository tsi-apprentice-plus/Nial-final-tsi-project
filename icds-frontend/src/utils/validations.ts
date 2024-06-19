import { param, body } from "express-validator";

export const passwordValidation = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];
export const emailValidation = body("email")
  .isEmail()
  .withMessage("Invalid email format");

export const usernameValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
];

export const _idValidation = param("_id")
  .isMongoId()
  .withMessage("Invalid _id format");
