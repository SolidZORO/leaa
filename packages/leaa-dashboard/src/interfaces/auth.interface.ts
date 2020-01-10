import { User } from '@leaa/common/src/entrys';

export type IAuthInfo = Pick<
  User,
  'id' | 'email' | 'authToken' | 'authExpiresIn' | 'name' | 'flatPermissions' | 'avatar_url'
>;
