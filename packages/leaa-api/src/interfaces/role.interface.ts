import { FindOneOptions } from 'typeorm';
import { RolesArgs, RoleArgs } from '@leaa/common/src/dtos/role';
import { Role } from '@leaa/common/src/entrys';

export type IRolesArgs = RolesArgs & FindOneOptions<Role>;
export type IRoleArgs = RoleArgs & FindOneOptions<Role>;
