import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth";
 import * as userService from "../services/user";
import { IUser } from "../interface/user";

export const getAll = async (_req: Request, res: Response) => {
  const data = await userService.getAll();
  return res.json({
    data,
  });
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const data = await userService.getById(id);

    return res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const getUserByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = String(req.params.username);

    const data = await userService.getUserByUsername(username);

    return res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const body: IUser = req.body;
    const data = await userService.update(id, body);

    return res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const data = await userService.deleteUser(id);

    return res.json({ message: "User successfully deleted" });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUsers = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("controllers", req.user);

    const id = req?.user?.id;
    const data = await userService.getById(id);

    return res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const userLogout = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req?.user?.id;
    const data = await userService.userLogout(id);
    return res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};
