declare namespace Express {
  export interface Request {
    user?: import("./schemas/usersSchema").UserData;
  }
}
