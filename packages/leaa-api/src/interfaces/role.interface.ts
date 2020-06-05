import { FindOneOptions } from 'typeorm';
import { RoleGetManyReq, RoleGetOneReq } from '@leaa/api/src/dtos/role';
import { Role } from '@leaa/api/src/entrys';

export type IRolesArgs = RoleGetManyReq & FindOneOptions<Role>;
export type IRoleArgs = RoleGetOneReq & FindOneOptions<Role>;
