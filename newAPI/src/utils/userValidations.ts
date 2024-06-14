import { body, query, param } from "express-validator";

import {
  emailValidation,
  passwordValidation,
  usernameValidation,
  // _idValidation,
  authValidation,
} from "./validations";

export const PostValidation = [
  emailValidation,
  ...passwordValidation,
  ...usernameValidation,
];

export const GetValidation = [
  query("username").isString().optional(),
  query("id").optional().isInt().withMessage("Invalid id format"),
  query("_id").optional().isMongoId().withMessage("Invalid _id format"),
  query("email").optional().isEmail().withMessage("Invalid email format"),
];

export const GetSingleValidation = [
  param("id").isInt().withMessage("Invalid id format"),
];

export const PatchValidation = [
  param("id").isInt().withMessage("Invalid id format"),
  body("username").optional(),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("password").optional(),
  ...authValidation,
];

export const DeleteValidation = [
  param("id").isInt().withMessage("Invalid id format"),
  ...authValidation,
];
