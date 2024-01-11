import HttpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import config from "../config";
import * as authService from "../services/auth";
import { IUser} from "../interface/user";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: IUser = req.body;
    const user=await authService.signup(body);
    return res.status(HttpStatus.CREATED).json({
      message: `Signed up ${body.username} `,
      userdata: user,
    });
   
  } catch (error) {
    next(error);
  }
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body } = req;

    const data = await authService.login(body);

    return res.json(data);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refreshToken(refreshToken);
    return res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;  
    if (!token) {
      return res.status(401).json({ error: 'Access token missing' });
    }
    // Split the token correctly
    const bearer = token.split(" ");
    
    if (bearer.length !== 2) {
      return res.status(401).json({ error: 'Invalid access token format' });
    }
    jwt.verify(bearer[1], config.jwt.accessTokenSecret!, (err, authData) => {
      if (err) {
        return res.status(401).json(err);
      } else{
        res.json({
          message: "user accessed",
          authData
        });
      }
    });
  } catch (error) {
    next(error);
  }
};





