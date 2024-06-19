import { Schema, model, models } from "mongoose";

const commentSchema = new Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const likesSchema = new Schema({
  username: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const postSchema = new Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  comments: { type: [commentSchema], default: [] },
  likes: { type: [likesSchema], default: [] },
});

const Post = models.Post || model("Post", postSchema);
export default Post;
