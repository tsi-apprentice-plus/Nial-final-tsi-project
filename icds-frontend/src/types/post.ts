import { Types } from "mongoose";
export type Comments = {
  username: string;
  timestamp: Date;
  content: string;
  _id: Types.ObjectId;
};

type Likes = {
  username: string;
  timestamp: Date;
};

export type IPost = {
  username: string;
  timestamp: Date;
  content: string;
  comments: Comments[];
  likes: Likes[];
  _id: Types.ObjectId;
};

export type IPosts = IPost[];