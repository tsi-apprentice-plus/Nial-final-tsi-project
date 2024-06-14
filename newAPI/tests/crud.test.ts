import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";

beforeEach(async () => {
  await mongoose.connect("mongodb://localhost:27017/socialAPI");
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("Post CRUD", () => {
  let postId: string;
  const postUserID = 4;
  const postUsername = "rgazey3";
  const postPassword = "lD9>dd%N8$fInB";
  const postInitialContent = "new post2";
  const postUpdatedContent = "updated post2";

  it("should create a new post", async () => {
    let res;
    try {
      res = await request(app)
        .post("/posts")
        .send({
          auth: {
            username: postUsername,
            password: postPassword,
          },
          content: postInitialContent,
        });
    } catch (error) {
      console.error(error);
    }
    if (!res) {
      return;
    }
    expect(res.status).toBe(200);
    const post = res.body;
    expect(post).toHaveProperty("comments", []);
    expect(post).toHaveProperty("likes", []);
    expect(post).toHaveProperty("content", postInitialContent);
    expect(post).toHaveProperty("userID", postUserID);
    postId = post._id;
  });

  it("should add a like to the post", async () => {
    let res;
    try {
      res = await request(app)
        .post(`/posts/${postId}/likes`)
        .send({
          auth: {
            username: postUsername,
            password: postPassword,
          },
        });
    } catch (error) {
      console.error(error);
    }
    if (!res) {
      return;
    }
    expect(res.status).toBe(200);
    const post = res.body;
    expect(post).toHaveProperty("comments", []);
    expect(post).toHaveProperty("likes");
    expect(post.likes.length).toBeGreaterThan(0);
    expect(post).toHaveProperty("content", postInitialContent);
    expect(post).toHaveProperty("userID", postUserID);
  });

  it("should get the post by filter", async () => {
    let res;
    try {
      res = await request(app).get(`/posts/${postId}`);
    } catch (error) {
      console.error(error);
    }
    if (!res) {
      return;
    }
    expect(res.status).toBe(200);
    const post = res.body;
    expect(post).toHaveProperty("comments", []);
    expect(post).toHaveProperty("likes");
    expect(post.likes.length).toBeGreaterThan(0);
    expect(post).toHaveProperty("content", postInitialContent);
    expect(post).toHaveProperty("userID", postUserID);
    expect(post).toHaveProperty("username", postUsername);
  });

  it("should update the post content", async () => {
    let res;
    try {
      res = await request(app)
        .patch(`/posts/${postId}`)
        .send({
          auth: {
            username: postUsername,
            password: postPassword,
          },
          content: postUpdatedContent,
        });
    } catch (error) {
      console.error(error);
    }
    if (!res) {
      return;
    }
    expect(res.status).toBe(200);
    const post = res.body;
    expect(post).toHaveProperty("comments", []);
    expect(post).toHaveProperty("likes");
    expect(post.likes.length).toBeGreaterThan(0);
    expect(post).toHaveProperty("content", postUpdatedContent);
  });

  it("should get the post with updated content", async () => {
    let res;
    try {
      res = await request(app).get(`/posts/${postId}`);
    } catch (error) {
      console.error(error);
    }
    if (!res) {
      return;
    }
    expect(res.status).toBe(200);
    const post = res.body;
    expect(post).toHaveProperty("comments", []);
    expect(post).toHaveProperty("likes");
    expect(post.likes.length).toBeGreaterThan(0);
    expect(post).toHaveProperty("content", postUpdatedContent);
    expect(post).toHaveProperty("userID", postUserID);
    expect(post).toHaveProperty("username", postUsername);
  });

  it("should delete the post", async () => {
    let res;
    try {
      res = await request(app)
        .delete(`/posts/${postId}`)
        .send({
          auth: {
            username: postUsername,
            password: postPassword,
          },
        });
    } catch (error) {
      console.error(error);
    }
    if (!res) {
      return;
    }
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Post deleted");
  });
});

describe("User CRUD", () => {
  const userUsername = "test";
  const userPassword = "youCantSeeMe";
  const userInitialEmail = "abc@aa.com";
  const userUpdatedEmail = "abc@bb.com";

  let userId: number;
  it("should create a new user", async () => {
    let res;
    try {
      res = await request(app).post("/users").send({
        username: userUsername,
        email: userInitialEmail,
        password: userPassword,
      });
    } catch (error) {
      console.error(error);
    }
    if (!res) {
      return;
    }
    expect(res.status).toBe(200);
    const user = res.body;
    expect(user).toHaveProperty("username", userUsername);
    expect(user).toHaveProperty("email", userInitialEmail);
    expect(user).toHaveProperty("password");
    expect(user.password).not.toBe(userPassword);
    userId = user.id;
  });

  it("should update the user email", async () => {
    let res;
    try {
      res = await request(app)
        .patch(`/users/${userId}`)
        .send({
          auth: {
            username: userUsername,
            password: userPassword,
          },
          email: userUpdatedEmail,
        });
    } catch (error) {
      console.error(error);
    }
    if (!res) {
      return;
    }
    expect(res.status).toBe(200);
    const user = res.body;
    expect(user).toHaveProperty("username", userUsername);
    expect(user).toHaveProperty("email", userUpdatedEmail);
  });

  it("should delete the user", async () => {
    let res;
    try {
      res = await request(app)
        .delete(`/users/${userId}`)
        .send({
          auth: {
            username: userUsername,
            password: userPassword,
          },
        });
    } catch (error) {
      console.error(error);
    }
    if (!res) {
      return;
    }
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted");
  });
});
