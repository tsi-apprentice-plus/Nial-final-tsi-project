import { Number, Types } from 'mongoose';
const BASE_URL = 'http://100.88.40.21:3101';

type auth = {
  username: string;
  password: string;
};
type CreatePost = {
  content: string;
  auth: auth[];
};
type LikePost = {
  auth: auth[];
};
type UpdatePost = {
  content?: string;
  auth: auth[];
};
type DeletePost = {
  auth: auth[];
};
type CreateUser = {
  username: string;
  password: string;
  email: string;
};
type UpdateUser = {
  auth: auth[];
  username?: string;
  password?: string;
  email?: string;
};
type DeleteUser = {
  auth: auth[];
};

export const createPost = async (data:CreatePost) => {
  const response = await fetch(`${BASE_URL}/posts`, { method: 'POST', body: JSON.stringify(data)});
  return response.json();
};

export const likePost = async (postId: Types.ObjectId, data:LikePost) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}/likes`, { method: 'POST', body: JSON.stringify(data)});
  return response.json();
};

export const getPosts = async (postId = '') => {
  const response = await fetch(`${BASE_URL}/posts${postId ? `?_id=${postId}` : ''}`);
  console.log(response);
  return response.json();
};

export const getPostsPaged = async (limit:number, page: number) => {
  const response = await fetch(`${BASE_URL}/posts?limit=${limit}&page=${page}`);
  return response.json();
}

export const searchPosts = async (search:string) => {
  const response = await fetch(`${BASE_URL}/posts?search=${search}`);
  return response.json();
};

export const updatePost = async (postId: Types.ObjectId, data:UpdatePost) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, { method: 'PATCH', body: JSON.stringify(data)});
  return response.json();
};

export const deletePost = async (postId: Types.ObjectId, data:DeletePost) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, { method: 'DELETE', body: JSON.stringify(data)});
  return response.json();
};

export const createUser = async (data:CreateUser) => {
  const response = await fetch(`${BASE_URL}/users`, { method: 'POST', body: JSON.stringify(data)});
  return response.json();
};

export const getUser = async (username = '') => {
  const response = await fetch(`${BASE_URL}/users${username ? `?username=${username}` : ''}`);
  return response.json();
};

export const updateUser = async (userId:number, data:UpdateUser) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, { method: 'PATCH', body: JSON.stringify(data)});
  return response.json();
};

export const deleteUser = async (userId:number, data:DeleteUser) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, { method: 'DELETE', body: JSON.stringify(data)});
  return response.json();
};
