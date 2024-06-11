import { Request, Response } from "express";
import app from './app';
import mongoose from "mongoose";

import http from 'http';
import { env } from "process";

const mongoUri = env.MONGO_URI || "mongodb://localhost:27017/socialAPI";

async function main(port: number) {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
  createHttpServer(port);
}

if (require.main === module) {
  main(3101).catch((err) => {
    console.error(err);
  });
}

export function createHttpServer(port: number) {
  const httpServer: http.Server = app.listen(port, () => {
    console.log('server started at http://localhost:' + port);
  });

  return httpServer;
}

export function closeHttpServer(httpServer: http.Server) {
  httpServer.close();
  mongoose.disconnect();
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});