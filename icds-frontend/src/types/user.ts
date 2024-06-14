import { Types } from "mongoose";

export type User = {
  _id: Types.ObjectId;
  id: number;
  username: string;
  email: string;
  password: string;
};