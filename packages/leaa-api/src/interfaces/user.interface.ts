import { FindOneOptions } from 'typeorm';
import { UserGetManyReq, UserGetOneReq } from '@leaa/api/src/dtos/user';
import { User } from '@leaa/api/src/entrys';

export type IUsersArgs = UserGetManyReq & FindOneOptions<User>;
export type IUserArgs = UserGetOneReq & FindOneOptions<User>;
