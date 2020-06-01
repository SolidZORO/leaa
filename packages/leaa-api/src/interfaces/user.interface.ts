import { FindOneOptions } from 'typeorm';
import { UserGetManyReq, UserGetOneReq } from '@leaa/common/src/dtos/user';
import { User } from '@leaa/common/src/entrys';

export type IUsersArgs = UserGetManyReq & FindOneOptions<User>;
export type IUserArgs = UserGetOneReq & FindOneOptions<User>;
