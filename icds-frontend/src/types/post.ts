import { Types } from "mongoose";
export type Comments = {
  userID: string;
  timestamp: Date;
  content: string;
  _id: Types.ObjectId;
};

type Likes = {
  userID: string;
  timestamp: Date;
};

export type Post = {
  userID: number;
  timestamp: Date;
  content: string;
  comments: Comments[];
  likes: Likes[];
  _id: Types.ObjectId;
};

export type PostWithUsername = Post & { username: string };

export type Posts = Post[];

export type PostsWithUsername = PostWithUsername[];
