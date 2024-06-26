import { Types } from "mongoose";
const BASE_URL = process.env.API_URL || "http://localhost:3101";
type auth = {
  username: string;
  password: string;
};
type CreatePost = {
  content: string;
  auth?: auth;
};
type LikePost = {
  auth?: auth;
};
type UpdatePost = {
  content?: string;
  auth?: auth;
};
type DeletePost = {
  auth?: auth;
};
type CreateUser = {
  username: string;
  password: string;
  email: string;
};
type UpdateUser = {
  auth: auth;
  username?: string;
  password?: string;
  email?: string;
};
type DeleteUser = {
  auth?: auth;
};

//hardcoded username and password, and data should NOT be optional :)
const username = "webuser";
const password = "test";
const auth = { username, password };
const HardcodedData: LikePost = { auth };

export const createPost = async (data: CreatePost) => {
  const datas = { ...data, auth };
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datas),
  });
  return response.json();
};

export async function likePost(postId: Types.ObjectId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(HardcodedData),
  });
  return response.json();
}

export const getPosts = async (postId = "") => {
  const url = `${BASE_URL}/posts${postId ? "?_id=" + postId : ""}`;
  const response = await fetch(url);
  return response.json();
};

export const getPostsPaged = async (limit: number, page: number) => {
  const queryParams = new URLSearchParams();
  queryParams.append("limit", limit.toString());
  queryParams.append("page", page.toString());
  const response = await fetch(`${BASE_URL}/posts?${queryParams.toString()}`);
  return response.json();
};

export const searchPosts = async (search: string) => {
  const response = await fetch(`${BASE_URL}/posts?search=${search}`);
  return response.json();
};

export const getPostSearchPaged = async (
  limit: number,
  page: number,
  search?: string,
) => {
  const queryParams = new URLSearchParams();
  queryParams.append("limit", limit.toString());
  queryParams.append("page", page.toString());
  if (search) {
    queryParams.append("search", search);
  }
  const url = `${BASE_URL}/posts?${queryParams.toString()}`;
  const response = await fetch(url);
  return response.json();
};

export const updatePost = async (postId: Types.ObjectId, data: UpdatePost) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(HardcodedData),
  });
  return response.json();
};

export const deletePost = async (postId: Types.ObjectId, data: DeletePost) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(HardcodedData),
  });
  return response.json();
};

export const createUser = async (data: CreateUser) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(HardcodedData),
  });
  return response.json();
};

export const getUser = async (username = "") => {
  const url = `${BASE_URL}/users${username ? "?username=" + username : ""}`;
  const response = await fetch(url);
  return response.json();
};

export const updateUser = async (userId: number, data: UpdateUser) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(HardcodedData),
  });
  return response.json();
};

export const deleteUser = async (userId: number, data: DeleteUser) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(HardcodedData),
  });
  return response.json();
};
export const unlikePost = async (postId: Types.ObjectId, data?: DeletePost) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(HardcodedData),
  });
  return response.json();
};
