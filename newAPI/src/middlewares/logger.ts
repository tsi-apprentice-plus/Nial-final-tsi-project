import { Request, Response, NextFunction } from "express";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;

  console.log(`${timestamp} - ${method} ${url}`);

  // Call the next middleware in the chain
  next();
};

export default loggerMiddleware;
