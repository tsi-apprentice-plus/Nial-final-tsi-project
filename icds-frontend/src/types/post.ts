import { Types } from 'mongoose';
type Comments = {
  userID: string;
  timestamp: Date;
  content: string;
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
export type Posts = Post[];