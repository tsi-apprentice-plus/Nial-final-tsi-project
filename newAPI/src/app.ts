import express from "express";
import postRouter from "./routes/postRoutes";
import userRouter from "./routes/userRoutes";
import loggerMiddleware from "./middlewares/logger";
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

app.use("/posts", postRouter);
app.use("/users", userRouter);

export default app;
