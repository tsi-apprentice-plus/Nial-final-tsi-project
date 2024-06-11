import request from "supertest";

const baseURL = "http://localhost:3101";

describe("Post CRUD", () => {
  let postId: string;
  const postUserID = 4;
  const postUsername = "rgazey3";
  const postPassword = "lD9>dd%N8$fInB";
  const postInitialContent = "new post2";
  const postUpdatedContent = "updated post2";

  it("should create a new post", async () => {
    const res = await request(baseURL)
      .post("/posts")
      .send({
        auth: {
          username: postUsername,
          password: postPassword,
        },
        content: postInitialContent,
      });
    console.log(res.body);
    expect(res.status).toBe(200);
    const post = res.body;
    expect(post).toHaveProperty("comments", []);
    expect(post).toHaveProperty("likes", []);
    expect(post).toHaveProperty("content", postInitialContent);
    expect(post).toHaveProperty("userID", postUserID);
    postId = post._id;
  });

  it("should add a like to the post", async () => {
    const res = await request(baseURL)
      .post(`/posts/${postId}/likes`)
      .send({
        auth: {
          username: postUsername,
          password: postPassword,
        },
      });

    expect(res.status).toBe(200);
    const post = res.body;
    expect(post).toHaveProperty("comments", []);
    expect(post).toHaveProperty("likes");
    expect(post.likes.length).toBeGreaterThan(0);
    expect(post).toHaveProperty("content", postInitialContent);
    expect(post).toHaveProperty("userID", postUserID);
  });

  it("should get the post by filter", async () => {
    const res = await request(baseURL).get(`/posts?_id=${postId}`);
    expect(res.status).toBe(200);
    const post = res.body;
    expect(post).toHaveProperty("comments", []);
    expect(post).toHaveProperty("likes");
    expect(post.likes.length).toBeGreaterThan(0);
    expect(post).toHaveProperty("content", postInitialContent);
    expect(post).toHaveProperty("userID", postUserID);
  });

  it("should update the post content", async () => {
    const res = await request(baseURL)
      .patch(`/posts/${postId}`)
      .send({
        auth: {
          username: postUsername,
          password: postPassword,
        },
        content: postUpdatedContent,
      });

    expect(res.status).toBe(200);
    const post = res.body;
    expect(post).toHaveProperty("comments", []);
    expect(post).toHaveProperty("likes");
    expect(post.likes.length).toBeGreaterThan(0);
    expect(post).toHaveProperty("content", postUpdatedContent);
    expect(post).toHaveProperty("userID", postUserID);
  });

  it("should get the post with updated content", async () => {
    const res = await request(baseURL).get(`/posts?_id=${postId}`);

    expect(res.status).toBe(200);
    const post = res.body;
    expect(post).toHaveProperty("comments", []);
    expect(post).toHaveProperty("likes");
    expect(post.likes.length).toBeGreaterThan(0);
    expect(post).toHaveProperty("content", postUpdatedContent);
    expect(post).toHaveProperty("userID", postUserID);
  });

  it("should delete the post", async () => {
    const res = await request(baseURL)
      .delete(`/posts/${postId}`)
      .send({
        auth: {
          username: postUsername,
          password: postPassword,
        },
      });

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
    const res = await request(baseURL).post("/users").send({
      username: userUsername,
      email: userInitialEmail,
      password: userPassword,
    });
    expect(res.status).toBe(200);
    const user = res.body;
    expect(user).toHaveProperty("username", userUsername);
    expect(user).toHaveProperty("email", userInitialEmail);
    expect(user).toHaveProperty("password");
    expect(user.password).not.toBe(userPassword);
    userId = user.id;
  });

  it("should update the user email", async () => {
    const res = await request(baseURL)
      .patch(`/users/${userId}`)
      .send({
        auth: {
          username: userUsername,
          password: userPassword,
        },
        email: userUpdatedEmail,
      });

    expect(res.status).toBe(200);
    const user = res.body;
    expect(user).toHaveProperty("username", userUsername);
    expect(user).toHaveProperty("email", userUpdatedEmail);
  });

  it("should delete the user", async () => {
    const res = await request(baseURL)
      .delete(`/users/${userId}`)
      .send({
        auth: {
          username: userUsername,
          password: userPassword,
        },
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted");
  });
});
