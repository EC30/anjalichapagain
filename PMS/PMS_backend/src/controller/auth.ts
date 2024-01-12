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





