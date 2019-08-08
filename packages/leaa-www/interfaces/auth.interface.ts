import { User } from '@leaa/common/entrys';

export type IAuthInfo = Pick<User, 'id' | 'email' | 'authToken' | 'authExpiresIn' | 'name'>;

export interface IReqCookies {
  cookies: { [key: string]: string };
}
