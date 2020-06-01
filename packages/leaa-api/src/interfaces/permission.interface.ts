import { FindOneOptions } from 'typeorm';
import { PermissionGetManyReq, PermissionGetOneReq } from '@leaa/common/src/dtos/permission';
import { Permission } from '@leaa/common/src/entrys';

export type IPermissionsArgs = PermissionGetManyReq & FindOneOptions<Permission>;
export type IPermissionArgs = PermissionGetOneReq & FindOneOptions<Permission>;
