import { Router, Response, Request } from "express";
import { body, validationResult, query, param } from "express-validator";
import Post from "../schemas/postsSchema";
import authenticateUser from "../middlewares/userAuth";
const postRouter = Router();

const getValidation = [
  query("userID").optional(),
  query("_id").optional().isMongoId().withMessage("Invalid _id format"),
  query("search").optional(),
  query("limit").optional().isInt().withMessage("Limit must be an integer"),
  query("page").optional().isInt().withMessage("Page must be an integer"),
];
// returns all posts, can filter by userID or _id
postRouter.get("/", getValidation, async (req: Request, res: Response) => {
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
    const posts = await Post.find({
      content: { $regex: search, $options: "i" },
    })
      .limit(limit)
      .skip(limit * (page - 1));
    return res.json(posts);
  }
  if (
    req.query.limit !== undefined &&
    req.query.page !== undefined &&
    req.query.search === undefined
  ) {
    const limit = parseInt(req.query.limit as string);
    const page = parseInt(req.query.page as string);
    const posts = await Post.find()
      .limit(limit)
      .skip(limit * (page - 1));
    return res.json(posts);
  }
  if (req.query.userID !== undefined) {
    const posts = await Post.find({ userID: req.query.userID });
    return res.json(posts);
  }
  if (req.query._id !== undefined) {
    const post = await Post.findOne({ _id: req.query._id });
    return res.json(post);
  }
  if (req.query.search !== undefined) {
    const search = req.query.search;
    const posts = await Post.find({
      content: { $regex: search, $options: "i" },
    });
    return res.json(posts);
  }
  const posts = await Post.find();
  return res.json(posts);
});

// auth required, _id required in params
const deleteValidation = [
  param("_id").isMongoId().withMessage("Invalid _id format"),
  body("auth").isObject().withMessage("Auth object is required"),
  body("auth.username")
    .notEmpty()
    .withMessage("Username is required in auth object"),
  body("auth.password")
    .notEmpty()
    .withMessage("Password is required in auth object"),
];
postRouter.delete(
  "/:_id",
  deleteValidation,
  authenticateUser,
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
      const post = await Post.findOne({ _id: _id });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.userID !== req.user.id) {
        const message =
          "User " +
          req.user.id +
          " is not authorized to delete this post owned by " +
          post.userID;
        console.log(post.userID, req.user.id);
        return res.status(401).json(message);
      }
      await post.deleteOne();
      res.json({ message: "Post deleted" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error(error);
    }
  }
);
const patchValidation = [
  param("_id").isMongoId().withMessage("Invalid _id format"),
  body("auth").isObject().withMessage("Auth object is required"),
  body("auth.username")
    .notEmpty()
    .withMessage("Username is required in auth object"),
  body("auth.password")
    .notEmpty()
    .withMessage("Password is required in auth object"),
  body("content").notEmpty().withMessage("Content needed"), // Add validation for other fields as needed
];
//  auth required, _id required in url, content required in body,returns updated post
postRouter.patch(
  "/:_id",
  patchValidation,
  authenticateUser,
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
      const post = await Post.findOne({ _id });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (post.userID !== req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      post.content = content;
      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error(error);
    }
  }
);

const postValidation = [
  body("auth").isObject().withMessage("Auth object is required"),
  body("auth.username")
    .notEmpty()
    .withMessage("Username is required in auth object"),
  body("auth.password")
    .notEmpty()
    .withMessage("Password is required in auth object"),
  body("content").notEmpty().withMessage("Content is required"),
];
// content required in body, returns created post
postRouter.post(
  "/",
  postValidation,
  authenticateUser,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.body.content) {
      return res.status(400).json({ message: "Content is required" });
    }
    if (!req.user) {
      console.log(req.user);
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
  }
);

const likesValidation = [
  param("_id").isMongoId().withMessage("Invalid _id format"),
  body("auth").isObject().withMessage("Auth object is required"),
  body("auth.username")
    .notEmpty()
    .withMessage("Username is required in auth object"),
  body("auth.password")
    .notEmpty()
    .withMessage("Password is required in auth object"),
];
// auth required, _id required in params, gets userID thru auth, returns liked post
postRouter.post(
  "/:_id/likes",
  likesValidation,
  authenticateUser,
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
      const post = await Post.findOne({ _id });
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
  }
);

type Like = {
  userID: number;
  timestamp: Date;
};

postRouter.delete(
  "/:_id/likes",
  likesValidation,
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const _id = req.params._id;
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userID = req.user.id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const post: any = await Post.findOne({ _id });
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
  }
);

export default postRouter;
