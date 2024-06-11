import { validationResult } from "express-validator";
import {
  GetValidation,
  DeleteValidation,
  PatchValidation,
  PostValidation,
  LikesValidation,
} from "../src/utils/postValidations";

const runValidation = async (req: any, validations: any) => {
  for (let validation of validations) {
    await validation.run(req);
  }
  return validationResult(req);
};

describe("GET /posts validation", () => {
  it("should fail with invalid _id format", async () => {
    const req = { query: { _id: "invalid_id" } };
    const result = await runValidation(req, GetValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: "Invalid _id format", path: "_id" }),
      ])
    );
  });

  it("should fail with non-integer limit", async () => {
    const req = { query: { limit: "noninteger" } };
    const result = await runValidation(req, GetValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Limit must be an integer",
          path: "limit",
        }),
      ])
    );
  });

  it("should fail with non-integer page", async () => {
    const req = { query: { page: "noninteger" } };
    const result = await runValidation(req, GetValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Page must be an integer",
          path: "page",
        }),
      ])
    );
  });
  it("should pass with valid query parameters", async () => {
    const req = { query: { limit: "5", page: "1", search: "test" } };
    const result = await runValidation(req, GetValidation);
    expect(result.isEmpty()).toBe(true);
  });
});

describe("DELETE /posts/:_id validation", () => {
  it("should fail with invalid _id format", async () => {
    const req = {
      params: { _id: "invalid_id" }
    };
    const result = await runValidation(req, DeleteValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: "Invalid _id format", path: "_id" }),
      ])
    );
  });

  it("should fail if auth object is missing", async () => {
    const req = { params: { _id: "60c72b2f9b1e8e2f88b978e4" } };
    const result = await runValidation(req, DeleteValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Auth object is required",
          path: "auth",
        }),
      ])
    );
  });

  it("should fail if username in auth object is missing", async () => {
    const req = {
      body: { auth: { password: "pass" } },
    };
    const result = await runValidation(req, DeleteValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Username is required in auth object",
          path: "auth.username",
        }),
      ])
    );
  });
  it("should fail if password in auth object is missing", async () => {
    const req = {
      body: { auth: { username: "user" } },
    };
    const result = await runValidation(req, DeleteValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Password is required in auth object",
          path: "auth.password",
        }),
      ])
    );
  });
  it("should pass with valid _id and auth object", async () => {
    const req = {
      params: { _id: "60c72b2f9b1e8e2f88b978e4" },
      body: { auth: { username: "user", password: "pass" } },
    };
    const result = await runValidation(req, DeleteValidation);
    expect(result.isEmpty()).toBe(true);
  });
});

describe("PATCH /posts/:_id validation", () => {
  it("should fail with invalid _id format", async () => {
    const req = {
      params: { _id: "invalid_id" },
      body: { auth: { username: "user", password: "pass" }, content: "test" },
    };
    const result = await runValidation(req, PatchValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: "Invalid _id format", path: "_id" }),
      ])
    );
  });

  it("should fail if auth object is missing", async () => {
    const req = {
      params: { _id: "60c72b2f9b1e8e2f88b978e4" },
      body: { content: "test" },
    };
    const result = await runValidation(req, PatchValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Auth object is required",
          path: "auth",
        }),
      ])
    );
  });

  it("should fail if username in auth object is missing", async () => {
    const req = {
      params: { _id: "60c72b2f9b1e8e2f88b978e4" },
      body: { auth: { password: "pass" }, content: "test" },
    };
    const result = await runValidation(req, PatchValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Username is required in auth object",
          path: "auth.username",
        }),
      ])
    );
  });

  it("should fail if content is missing", async () => {
    const req = {
      params: { _id: "60c72b2f9b1e8e2f88b978e4" },
      body: { auth: { username: "user", password: "pass" } },
    };
    const result = await runValidation(req, PatchValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: "Content needed", path: "content" }),
      ])
    );
  });
});

describe("POST /posts validation", () => {
  it("should fail if auth object is missing", async () => {
    const req = { body: { content: "test" } };
    const result = await runValidation(req, PostValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Auth object is required",
          path: "auth",
        }),
      ])
    );
  });

  it("should fail if username in auth object is missing", async () => {
    const req = { body: { auth: { password: "pass" }, content: "test" } };
    const result = await runValidation(req, PostValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Username is required in auth object",
          path: "auth.username",
        }),
      ])
    );
  });

  it("should fail if content is missing", async () => {
    const req = { body: { auth: { username: "user", password: "pass" } } };
    const result = await runValidation(req, PostValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Content is required",
          path: "content",
        }),
      ])
    );
  });
});

describe("POST /posts/:_id/likes validation", () => {
  it("should fail with invalid _id format", async () => {
    const req = {
      params: { _id: "invalid_id" },
    };
    const result = await runValidation(req, LikesValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: "Invalid _id format", path: "_id" }),
      ])
    );
  });

  it("should fail if auth object is missing", async () => {
    const req = { params: { _id: "60c72b2f9b1e8e2f88b978e4" } };
    const result = await runValidation(req, LikesValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Auth object is required",
          path: "auth",
        }),
      ])
    );
  });

  it("should fail if username in auth object is missing", async () => {
    const req = {
      body: { auth: { password: "pass" } },
    };
    const result = await runValidation(req, LikesValidation);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Username is required in auth object",
          path: "auth.username",
        }),
      ])
    );
  });
  it("should pass with valid _id and auth object", async () => {
    const req = {
      params: { _id: "60c72b2f9b1e8e2f88b978e4" },
      body: { auth: { username: "user", password: "pass" } },
    };
    const result = await runValidation(req, LikesValidation);
    expect(result.isEmpty()).toBe(true);
  });
});
