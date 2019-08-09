import { User } from '@leaa/common/entrys';

export type IAuthInfo = Pick<User, 'email' | 'authToken' | 'authExpiresIn' | 'name'>;

export interface IReqCookies {
  cookies: { [key: string]: string };
}
