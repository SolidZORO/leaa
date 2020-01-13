import { User } from '@leaa/common/src/entrys';

export type IAuthInfo = Pick<User, 'email' | 'authToken' | 'authExpiresIn' | 'name' | 'avatar_url'>;
