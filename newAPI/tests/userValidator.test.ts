import { validationResult } from "express-validator";
import {
  GetValidation,
  // DeleteValidation,
  // PatchValidation,
  PostValidation,
} from "../src/utils/userValidations";

const runValidation = async (req: any, validations: any) => {
  for (const validation of validations) {
    await validation.run(req);
  }
  return validationResult(req);
};

describe("POST /users validation", () => {
  it("should pass with valid details", async () => {
    const req = {
      body: {
        username: "test333",
        email: "test@legit.com",
        password: "abcpassword123",
      },
    };
    const result = await runValidation(req, PostValidation);
    expect(result.isEmpty()).toBe(true);
  });
  describe("Invalid email", () => {
    it("should fail with invalid no @", async () => {
      const req = { body: { email: "invalidemail.com" } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Invalid email format",
            path: "email",
          }),
        ]),
      );
    });
    it("should fail with invalid no .", async () => {
      const req = { body: { email: "invalidemail@gmailcom" } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Invalid email format",
            path: "email",
          }),
        ]),
      );
    });
    it("should fail with no email username", async () => {
      const req = { body: { email: "@gmail.com" } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Invalid email format",
            path: "email",
          }),
        ]),
      );
    });
    it("should fail with no email domain", async () => {
      const req = { body: { email: "invalidemail@.com" } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Invalid email format",
            path: "email",
          }),
        ]),
      );
    });
    it("should fail with no TLD", async () => {
      const req = { body: { email: "invalidemail@gmail." } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Invalid email format",
            path: "email",
          }),
        ]),
      );
    });
    it("should fail with no email", async () => {
      const req = { body: { email: "" } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Invalid email format",
            path: "email",
          }),
        ]),
      );
    });
    it("should pass with valid email", async () => {
      const req = { body: { email: "validemail@gmail.com" } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "email",
          }),
        ]),
      );
    });
  });
  describe("Invalid username", () => {
    it("should fail with no username", async () => {
      const req = { body: { username: "" } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Username is required",
            path: "username",
          }),
        ]),
      );
    });
    it("should fail with short username", async () => {
      const req = { body: { username: "ab" } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Username must be at least 3 characters",
            path: "username",
          }),
        ]),
      );
    });
    it("should pass with valid username", async () => {
      const req = { body: { username: "user" } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "username",
          }),
        ]),
      );
    });
  });
  describe("Invalid password", () => {
    it("should fail with no password", async () => {
      const req = { body: { password: "" } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Password is required",
            path: "password",
          }),
        ]),
      );
    });
    it("should fail with short password", async () => {
      const req = { body: { password: "abc" } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Password must be at least 8 characters",
            path: "password",
          }),
        ]),
      );
    });
    it("should pass with password", async () => {
      const req = { body: { password: "abcpassword123" } };
      const result = await runValidation(req, PostValidation);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "password",
          }),
        ]),
      );
    });
  });
});
describe("GET /users validation", () => {
  it("should pass with no query", async () => {
    const req = { query: {} };
    const result = await runValidation(req, GetValidation);
    expect(result.isEmpty()).toBe(true);
  });
  it("should pass with valid _id", async () => {
    const req = { query: { _id: "60c72b2f9b1e8e2f88b978e4" } };
    const result = await runValidation(req, GetValidation);
    expect(result.isEmpty()).toBe(true);
  });
  it("should pass with valid id", async () => {
    const req = { query: { id: "1" } };
    const result = await runValidation(req, GetValidation);
    expect(result.isEmpty()).toBe(true);
  });
  it("should pass with valid email", async () => {
    const req = { query: { email: "validemail@gmail.com" } };
    const result = await runValidation(req, GetValidation);
    expect(result.isEmpty()).toBe(true);
  });
  it("should pass with valid username", async () => {
    const req = { query: { username: "user" } };
    const result = await runValidation(req, GetValidation);
    expect(result.isEmpty()).toBe(true);
  });
  it("should fail with invalid id", async () => {
    const req = { query: { id: "invalid_id" } };
    const result = await runValidation(req, GetValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: "Invalid id format", path: "id" }),
      ]),
    );
  });
  it("should fail with invalid _id", async () => {
    const req = { query: { _id: "invalid_id" } };
    const result = await runValidation(req, GetValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: "Invalid _id format", path: "_id" }),
      ]),
    );
  });
  it("should fail with invalid email", async () => {
    const req = { query: { email: "invalidemail.com" } };
    const result = await runValidation(req, GetValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: "Invalid email format", path: "email" }),
      ]),
    );
  });
});
