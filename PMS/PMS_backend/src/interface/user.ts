export interface IUser {
  username: string;
  fullname: string;
  email:string,
  password: string;
  refresh_token: string
}

export interface Ilogin {
  username: string;
  password: string;
}

export interface DecodedToken{
  id: string;
  username:string;
  iat: number;
  exp: number;
}
