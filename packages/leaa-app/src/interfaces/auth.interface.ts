export interface ILogin {
  email: string;
  password: string;
}

export interface IAuthInfo {
  email: string;
  authToken: string;
  authExpiresIn: number;
  name: string;
}

export type IAuthBaseInfo = Pick<IAuthInfo, 'email' | 'name'>;
