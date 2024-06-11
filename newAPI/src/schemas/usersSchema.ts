import { Schema, model } from "mongoose";

export interface UserData {
  _id: string;
  id: number;
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<UserData>({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model<UserData>("User", UserSchema);

export default User;
