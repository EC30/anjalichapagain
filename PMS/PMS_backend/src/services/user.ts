import UserModel from "../models/user";
import NotFoundError from "../error/notFoundError";
import { IUser } from "../interface/user";
import BadRequestError from "../error/badRequestError";
import { userSchema } from '../schema/user';
import { updateUserSchema } from "../schema/user";
import { v4 as uuidv4 } from 'uuid';

export const getAll = async () => {
  const data = await UserModel.getAll();

  return data;
};

export const getUserByUsername = async (username: string) => {
  const data = await UserModel.getUserByUsername(username);
  if (!data) {
    throw new NotFoundError(`User with username: ${username} not found`);
  }
  return data;
};

export const getById = async (id: number) => {
  const data = await UserModel.getById(id);

  if (!data) {
    throw new NotFoundError(`User with id: ${id} not found`);
  }

  return data;
};

export const update = async (id: number, body: IUser) => {
  const user = await UserModel.getById(id);

  if (!user) {
    throw new NotFoundError(`User with id: ${id} not found`);
  }

  await UserModel.update(id, body);

  const updatedUser = await UserModel.getById(id);

  return updatedUser;
};
export const deleteUser = async (id: number) => {
  const user = await UserModel.getById(id);

  if (!user) {
    throw new NotFoundError(`User with id: ${id} not found`);
  }

  await UserModel.delete(id);
};

export const userLogout = async (id: number) => {
  const user = await UserModel.getById(id);
  const refreshToken = uuidv4();
  if (!user) {
    throw new NotFoundError(`User with id: ${id} not found`);
  }

  await UserModel.updateRefreshToken(id, refreshToken);
};
