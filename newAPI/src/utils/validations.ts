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

export const authValidation = [
  body("auth").isObject().withMessage("Auth object is required"),
  body("auth.username")
    .notEmpty()
    .withMessage("Username is required in auth object"),
  body("auth.password")
    .notEmpty()
    .withMessage("Password is required in auth object"),
];
