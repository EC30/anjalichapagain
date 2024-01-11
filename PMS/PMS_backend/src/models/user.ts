import BaseModel from "./baseModel";

import { IUser } from "../interface/user";

export default class UserModel extends BaseModel {
  static async getAll() {
    return this.queryBuilder()
      .select({
        id: "id",
        username: "username",
        fullname:"fullname",
        email:"email"
      })
      .from("users");
  }

  static async getById(id: number) {
    return this.queryBuilder()
      .select({
        id: "id",
        username: "username",
        fullname:"fullname",
        email:"email"
      })
      .from("users")
      .where({ id })
      .first();
  }

  static async getUserByUsername(username: string) {
    const user = await this.queryBuilder()
      .select({
        id: "id",
        username: "username",
        fullname:"fullname",
        email:"email",
        password: "password",
        refreshToken:"refresh_token"
      })
      .from("users")
      .where({ username });

    return user?.[0];
  }
  static async getUserByEmail(email: string) {
    const user = await this.queryBuilder()
      .select({
        id: "id",
        username: "username",
        fullname:"fullname",
        email:"email",
        password: "password",
      })
      .from("users")
      .where({ email });

    return user?.[0];
  }


  static async create(user: IUser) {
    // return this.queryBuilder().insert(user).table("users");
    return this.queryBuilder().insert(user).table("users").returning("*");
  }

  static async update(id: number, user: IUser) {
    return this.queryBuilder().update(user).table("users").where({ id });
  }

  static async delete(id: number) {
    return this.queryBuilder().table("users").where({ id }).del();
  }

  static  async validateRefreshToken (refreshToken:string) {
      const result =this.queryBuilder()
      .select({
        id: "id",
        refreshToken: "refresh_token",
      })
      .from("users")
      .where({ refreshToken })
      .first();
      // Return true if the refresh token exists, false otherwise
      return result !== null;
  };
  static  async getUserByRefreshToken (refreshToken:string) {
    const userRecord =this.queryBuilder()
    .select({
      id: "id",
      refreshToken: "refresh_token",
    })
    .from("users")
    .where({ refreshToken })
    .first();
    return userRecord;
};

}
