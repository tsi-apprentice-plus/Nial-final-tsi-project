import { Types } from "mongoose";

export type User = {
  _id: Types.ObjectId;
  id: number;
  email: string;
  nickname: string;
  name: string;
};
