import { Router, Response, Request } from "express";
import { validationResult } from "express-validator";
import User from "../schemas/usersSchema";
import authenticateUser from "../middlewares/userAuth";
import bcrypt from "bcrypt";
import {
  GetValidation,
  GetSingleValidation,
  DeleteValidation,
  PatchValidation,
  PostValidation,
} from "../utils/userValidations";

const userRouter = Router();

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

  const usernameExists = await User.findOne({ username: { $eq: username } });
  if (usernameExists) {
    return res.status(400).json({ message: "username already exists" });
  }
  const emailExists = await User.findOne({ email: { $eq: email } });
  if (emailExists) {
    return res.status(400).json({ message: "email already exists" });
  }
  const lastUser = await User.findOne({}).sort({ id: -1 });
  const newID = lastUser ? lastUser.id + 1 : 1;
  const user = new User({
    id: newID,
    username: username,
    email: email,
    password: hashedPassword,
  });
  const newUser = await user.save();
  res.json(newUser);
});

userRouter.get(
  "/:id",
  GetSingleValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.params.id) {
      return res.status(400).json({ message: "id is required" });
    }
    try {
      const id = req.params.id;
      const user = await User.findOne({ id: { $eq: id } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error(error);
    }
  },
);

// can take _id, id, email, or username as query parameter
userRouter.get("/", GetValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (req.query._id !== undefined) {
    const users = await User.find({ _id: { $eq: req.query._id } });
    return res.json(users);
  } else if (req.query.email !== undefined) {
    const users = await User.find({ email: { $eq: req.query.email } });
    return res.json(users);
  } else if (req.query.username !== undefined) {
    const users = await User.find({ username: { $eq: req.query.username } });
    return res.json(users);
  } else if (req.query.id !== undefined) {
    const users = await User.find({ id: { $eq: req.query.id } });
    return res.json(users);
  } else {
    const users = await User.find();
    return res.json(users);
  }
});

// can take email, username or password in body, must username and password in auth
userRouter.patch(
  "/:id",
  PatchValidation,
  authenticateUser,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { username, email, password } = req.body;

    const userFields: { [key: string]: string } = { username, email, password };
    const fieldsToUpdate = Object.keys(userFields).filter(
      (field) => userFields[field] !== undefined,
    );

    if (!username && !email && !password) {
      return res.status(400).json({ message: "No fields to update" });
    }

    if (fieldsToUpdate.length > 1) {
      return res
        .status(400)
        .json({ message: "Only one field can be updated at a time" });
    }

    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) {
      user.username = username;
    } else if (email) {
      user.email = email;
    } else if (password) {
      user.password = await bcrypt.hash(password, 10);
    } else {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  },
);

// must have username and password in auth
userRouter.delete(
  "/:id",
  DeleteValidation,
  authenticateUser,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ id: { $eq: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.json({ message: "User deleted" });
  },
);

export default userRouter;
