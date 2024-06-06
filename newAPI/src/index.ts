import express, { Request, Response } from "express";
import app from './app';
import mongoose from "mongoose";
import Post from "./schemas/postsSchema";
import User from "./schemas/usersSchema";
import postRouter from "./routes/postRoutes";
import userRouter from "./routes/userRoutes";
import loggerMiddleware from "./middlewares/logger";
import { create } from "domain";
import http from 'http';
import { env } from "process";
import cors from 'cors';

// const app = express();
const port = 3101;

app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

app.use("/posts", postRouter);
app.use("/users", userRouter);

const mongoUri = env.MONGO_URI || "mongodb://localhost:27017/socialAPI";

async function main() {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
  createHttpServer();
}

main().catch((err) => {
  console.error(err);
});

function createHttpServer() {
  const httpServer: http.Server = app.listen(port, () => {
    console.log('server started at http://localhost:' + port);
  });

  return httpServer;
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});
export default createHttpServer;