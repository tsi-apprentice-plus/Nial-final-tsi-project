import { Router, Response, Request } from "express";
import { body, validationResult, query, param } from "express-validator";
import User from "../schemas/usersSchema";
import authenticateUser from "../middlewares/userAuth";
import bcrypt from "bcrypt";

const userRouter = Router();

const PostValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];
// username, email, and password required
userRouter.post("/", PostValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const email = req.body.email;
  const username = req.body.username;
  const plainPassword = req.body.password;
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res.status(400).json({ message: "username already exists" });
  }
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ message: "email already exists" });
  }
  const lastUser = await User.findOne({}).sort({ id: -1 });
  const newID = lastUser ? lastUser.id + 1 : 1;
  console.log("newID: ", newID);
  const user = new User({
    id: newID,
    username: username,
    email: email,
    password: hashedPassword,
  });
  console.log(
    "Created new user: ",
    user,
    "with id: ",
    user.id,
    "and email: ",
    user.email
  ),
    "and password: ",
    user.password;
  const newUser = await user.save();
  res.json(newUser);
});

const getValidation = [
  query("_id").optional().isMongoId().withMessage("Invalid _id format"),
  query("email").optional().isEmail().withMessage("Invalid email format"),
  query("username").optional(),
  query("id").optional().isInt().withMessage("Invalid id format"),
];

// can take _id, id, email, or username as query parameter
userRouter.get("/", getValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (req.query._id !== undefined) {
    const users = await User.find({ _id: req.query._id });
    return res.json(users);
  } else if (req.query.email !== undefined) {
    const users = await User.find({ email: req.query.email });
    return res.json(users);
  } else if (req.query.username !== undefined) {
    const users = await User.find({ username: req.query.username });
    return res.json(users);
  } else if (req.query.id !== undefined) {
    const users = await User.find({ id: req.query.id });
    return res.json(users);
  } else {
    const users = await User.find();
    return res.json(users);
  }
});
// can take email, username or password in body, must username and password in auth
const patchValidation = [
  param("id").isInt().withMessage("Invalid id format"),
  body("username").optional(),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("password").optional(),
  body("auth").isObject().withMessage("Auth object is required"),
  body("auth.username")
    .notEmpty()
    .withMessage("Username is required in auth object"),
  body("auth.password")
    .notEmpty()
    .withMessage("Password is required in auth object"),
];
userRouter.patch(
  "/:id",
  patchValidation,
  authenticateUser,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!req.body.username && !req.body.email && !req.body.password) {
      return res.status(400).json({ message: "No fields to update" });
    }
    if (req.body.length > 1) {
      return res
        .status(400)
        .json({ message: "Only one field can be updated at a time" });
    }
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.body.username) {
      user.username = req.body.username;
    } else if (req.body.email) {
      user.email = req.body.email;
    } else if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    } else {
      return res.status(400).json({ message: "No fields to update" });
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  }
);

const deleteValidation = [
  param("id").isInt().withMessage("Invalid id format"),
  body("auth").isObject().withMessage("Auth object is required"),
  body("auth.username")
    .notEmpty()
    .withMessage("Username is required in auth object"),
  body("auth.password")
    .notEmpty()
    .withMessage("Password is required in auth object"),
];

// must have username and password in auth
userRouter.delete(
  "/:id",
  deleteValidation,
  authenticateUser,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.json({ message: "User deleted" });
  }
);

export default userRouter;
