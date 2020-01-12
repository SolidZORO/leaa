import { FindOneOptions } from 'typeorm';
import { PermissionsArgs, PermissionArgs } from '@leaa/common/src/dtos/permission';
import { Permission } from '@leaa/common/src/entrys';

export type IPermissionsArgs = PermissionsArgs & FindOneOptions<Permission>;
export type IPermissionArgs = PermissionArgs & FindOneOptions<Permission>;
