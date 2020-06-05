import { User } from '@leaa/api/src/entrys';

export type IAuthInfo = Pick<
  User,
  'id' | 'email' | 'authToken' | 'authExpiresIn' | 'name' | 'flatPermissions' | 'avatar_url'
>;

export type ICaptchaResult = {
  img: string;
  count: number;
};
