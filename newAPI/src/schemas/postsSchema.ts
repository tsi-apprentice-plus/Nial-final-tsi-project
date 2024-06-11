import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  userID: { type: Number, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const likesSchema = new Schema({
  userID: { type: Number, required: true },
  timestamp: { type: Date, required: true },
});

const postSchema = new Schema({
  userID: { type: Number, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  comments: { type: [commentSchema], default: [] },
  likes: { type: [likesSchema], default: [] },
});

const Post = model("Post", postSchema);

export default Post;
