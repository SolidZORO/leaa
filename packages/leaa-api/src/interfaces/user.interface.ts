import { FindOneOptions } from 'typeorm';
import { UsersArgs, UserArgs } from '@leaa/common/src/dtos/user';
import { User } from '@leaa/common/src/entrys';

export type IUsersArgs = UsersArgs & FindOneOptions<User>;
export type IUserArgs = UserArgs & FindOneOptions<User>;
