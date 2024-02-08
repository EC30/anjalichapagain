import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import config from "../config";

import UnauthenticatedError from "../error/unauthenticatedError";

//This middleware is responsible for checking the validity of the JWT in the Authorization header and decoding it.
export const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    console.log(req.body);
    // { authorization: "Bearer <token>"}
    const token = req.headers.authorization?.split(" ")[1] as string;

    if (!token) {
      throw new UnauthenticatedError("No access token");
    }

    const decode = jwt.verify(token, config.jwt.accessTokenSecret!);

    req.user = decode;

    next();
  } catch (err) {
    next(err);
  }
};
