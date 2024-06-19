import { Router, Response, Request } from "express";
import { validationResult } from "express-validator";
import Post from "../schemas/postsSchema";
import { jwtCheck } from "../middlewares/jwtCheck";
const postRouter = Router();
import {
  GetValidation,
  GetSingleValidation,
  DeleteValidation,
  PatchValidation,
  PostValidation,
  LikesValidation,
  CommentValidation,
} from "../utils/postValidations";

postRouter.get(
  "/:_id",
  GetSingleValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.params._id) {
      return res.status(400).json({ message: "_id is required" });
    }
    try {
      const _id = req.params._id;
      const post = await Post.findOne({ _id: { $eq: _id } });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      return res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error(error);
    }
  },
);

// returns all posts, can filter by userID or _id
postRouter.get(
  "/",
  GetValidation,
  jwtCheck,
  async (req: Request, res: Response) => {
    let posts;
    console.log(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (
      req.query.limit !== undefined &&
      req.query.page !== undefined &&
      req.query.search !== undefined
    ) {
      const limit = parseInt(req.query.limit as string);
      const page = parseInt(req.query.page as string);
      const search = req.query.search;
      posts = await Post.find({
        content: { $regex: search, $options: "i" },
      })
        .limit(limit)
        .skip(limit * (page - 1));
    } else if (
      req.query.limit !== undefined &&
      req.query.page !== undefined &&
      req.query.search === undefined
    ) {
      const limit = parseInt(req.query.limit as string);
      const page = parseInt(req.query.page as string);
      posts = await Post.find()
        .limit(limit)
        .skip(limit * (page - 1));
    } else if (req.query.userID !== undefined) {
      posts = await Post.find({ userID: { $eq: req.query.userID } });
    } else if (req.query.search !== undefined) {
      const search = req.query.search;
      posts = await Post.find({
        content: { $regex: search, $options: "i" },
      });
    } else {
      posts = await Post.find();
    }
    if (!posts) {
      return res.status(404).json({ message: "Posts not found" });
    }
    res.json(posts);
  },
);

postRouter.delete(
  "/:_id",
  DeleteValidation,
  jwtCheck,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const _id = req.params._id;
      if (!req.params._id) {
        return res.status(400).json({ message: "_id is required" });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const post = await Post.findOne({ _id: { $eq: _id } });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.username !== req.body.username) {
        const message =
          "User " +
          req.body.username +
          " is not authorized to delete this post owned by " +
          post.username;
        return res.status(401).json(message);
      }
      await post.deleteOne();
      res.json({ message: "Post deleted" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error(error);
    }
  },
);

//  auth required, _id required in url, content required in body,returns updated post
postRouter.patch(
  "/:_id",
  PatchValidation,
  jwtCheck,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.params._id) {
      return res.status(400).json({ message: "_id is required" });
    }
    if (!req.body.content) {
      return res.status(400).json({ message: "Content is required" });
    }
    try {
      const _id = req.params._id;
      const content = req.body.content;
      const post = await Post.findOne({ _id: { $eq: _id } });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (post.username !== req.body.username) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      post.content = content;
      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error(error);
    }
  },
);

// content required in body, returns created post
postRouter.post(
  "/",
  PostValidation,
  jwtCheck,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.body.content) {
      return res.status(400).json({ message: "Content is required" });
    }
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const content = req.body.content;
      const userID = req.user.id;
      const timestamp = new Date();
      const post = new Post({ content, userID, timestamp });
      const createdPost = await post.save();
      res.json(createdPost);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error(error);
    }
  },
);

// auth required, _id required in params, gets userID thru auth, returns liked post
postRouter.post(
  "/:_id/likes",
  LikesValidation,
  jwtCheck,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const _id = req.params._id;
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userID = req.user.id;
      const post = await Post.findOne({ _id: { $eq: _id } });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      const timestamp = new Date();
      post.likes.push({ userID: userID, timestamp });
      const likedPost = await post.save();
      res.json(likedPost);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error(error);
    }
  },
);

type Like = {
  userID: number;
  timestamp: Date;
};

postRouter.delete(
  "/:_id/likes",
  LikesValidation,
  jwtCheck,
  async (req: Request, res: Response) => {
    try {
      const _id = req.params._id;
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userID = req.user.id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const post: any = await Post.findOne({ _id: { $eq: _id } });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.likes.length === 0) {
        return res.status(400).json({ message: "Post has no likes" });
      }
      post.likes = post.likes.filter((like: Like) => like.userID !== userID);
      const unlikedPost = await post.save();
      res.json(unlikedPost);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error(error);
    }
  },
);

postRouter.post(
  "/:_id/comments",
  CommentValidation,
  jwtCheck,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const _id = req.params._id;
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userID = req.user.id;
      const post = await Post.findOne({ _id: { $eq: _id } });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      const timestamp = new Date();
      const content = req.body.content;
      post.comments.push({ userID: userID, content: content, timestamp });
      const commentedPost = await post.save();
      res.json(commentedPost);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error(error);
    }
  },
);

export default postRouter;
