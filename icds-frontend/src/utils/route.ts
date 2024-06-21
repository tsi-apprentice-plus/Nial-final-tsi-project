import { Types } from "mongoose";
import { env } from "process";

const BASE_URL = env.API_URL ?? "http://localhost:3000/api";

type CreatePost = {
  content: string;
  image?: string;
};
type UpdatePost = {
  content?: string;
};

export const createPost = async (data: CreatePost) => {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export async function likePost(postId: Types.ObjectId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

export const getPosts = async (post_id?: string) => {
  let url = `${BASE_URL}/posts`;
  if (post_id) {
    url += `?_id=${post_id}`;
  }
  const response = await fetch(url);
  return response.json();
};

export const getUsersPosts = async (username: string) => {
  let url = `${BASE_URL}/posts`;
  if (username) {
    url += `?username=${username}`;
  }
  const response = await fetch(url);
  return response.json();
};

export const getPostsPaged = async (limit: number, page: number) => {
  const response = await fetch(`${BASE_URL}/posts?limit=${limit}&page=${page}`);
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
  const response = await fetch(
    BASE_URL + "/posts?limit=" + limit + "&page=" + page + "&search=" + search,
  );
  return response.json();
};

export const getSinglePost = async (postId: string) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`);
  return response.json();
};

export const updatePost = async (postId: Types.ObjectId) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const deletePost = async (postId: Types.ObjectId) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export async function unlikePost(postId: Types.ObjectId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

export const createComment = async (
  postId: Types.ObjectId,
  content: string,
) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return response.json();
};
