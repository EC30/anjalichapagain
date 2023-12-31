import UserModel from "../models/user";
import NotFoundError from "../error/notFoundError";
import { IUser } from "../interface/user";
import BadRequestError from "../error/badRequestError";
import { userSchema } from '../schema/user';
import { updateUserSchema } from "../schema/user";

export const getAll = async () => {
  const data = await UserModel.getAll();

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

// export const update = async (id: number, body: IUser) => {
//   const user = await UserModel.getById(id);

//   if (!user) {
//     throw new NotFoundError(`User with id: ${id} not found`);
//   }

//   // Determine whether to use full update schema or partial update schema
//   const schemaToUse = body.fullname ? userSchema : userUpdateSchema;

//   const { error, value } = schemaToUse.validate(body, { abortEarly: false });

//   if (error) {
//     throw new BadRequestError(error.details.map((err) => err.message).join(', '));
//   }

//   await UserModel.update(id, value);

//   const updatedUser = await UserModel.getById(id);

//   return {
//     updatedUser,
//     message: "User updated successfully",
//   };
// };


export const deleteUser = async (id: number) => {
  const user = await UserModel.getById(id);

  if (!user) {
    throw new NotFoundError(`User with id: ${id} not found`);
  }

  await UserModel.delete(id);
};
