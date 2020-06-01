import { FindOneOptions } from 'typeorm';
import { RoleGetManyReq, RoleGetOneReq } from '@leaa/common/src/dtos/role';
import { Role } from '@leaa/common/src/entrys';

export type IRolesArgs = RoleGetManyReq & FindOneOptions<Role>;
export type IRoleArgs = RoleGetOneReq & FindOneOptions<Role>;
