import { Types } from "mongoose";

export type IUser = {
  _id: Types.ObjectId;
  id: number;
  username: string;
  email: string;
  password: string;
};
