import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import config from "../config";
import UserModel from "../models/user";
import { IUser } from "../interface/user";
import { v4 as uuidv4 } from 'uuid';
import notFoundError from '../error/notFoundError';
import BadRequestError from "../error/badRequestError";

import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../constant/jwt";

const SALT_ROUNDS = 10;

export const signup = async (body: IUser) => {
  const refreshToken = uuidv4();
  const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);
  await UserModel.create({
    ...body,
    password: hashedPassword,
    refresh_token:refreshToken
  });

  return {
    message: "User signed up successfully",
  };
};

export const login = async (body: IUser) => {
  const userDetail = await UserModel.getUserByUsername(body.username);

  if (!userDetail) {
    throw new BadRequestError("Invalid Email or Password");
  }
  const passwordMatch = await bcrypt.compare(body.password, userDetail.password);

  if (!passwordMatch) {
    throw new BadRequestError("Invalid Email or Password");
  }
  const user = {
    id: userDetail.id,
    username: userDetail.username,
  };

  const accessToken = jwt.sign(user, config.jwt.accessTokenSecret!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = userDetail.refreshToken;

  return {
    accessToken,
    refreshToken,
    message: "User login successfully",
  };
};

export const refreshToken = async (refreshToken:string) => {
    // Check if the refresh token is valid
    const isValidRefreshToken = await UserModel.validateRefreshToken(refreshToken);

    if (!isValidRefreshToken) {
      throw new BadRequestError("Invalid refresh token");
    }
    // Obtain user information from the refresh token
    const userRecord = await UserModel.getUserByRefreshToken(refreshToken);

    if (!userRecord) {
      throw new BadRequestError( 'Invalid user token');
    }
    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userId: userRecord.id, username: userRecord.username },
      config.jwt.accessTokenSecret!,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    return {
      accessToken: newAccessToken,
      message: "Access token refreshed successfully",
    };
};





