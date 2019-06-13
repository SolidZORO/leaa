import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Permission } from '@leaa/common/entrys';
import { BaseService } from '@leaa/api/modules/base/base.service';
import {
  PermissionsArgs,
  PermissionsObject,
  PermissionArgs,
  CreatePermissionInput,
  UpdatePermissionInput,
} from '@leaa/common/dtos/permission';

@Injectable()
export class PermissionService extends BaseService<
  Permission,
  PermissionsArgs,
  PermissionsObject,
  PermissionArgs,
  CreatePermissionInput,
  UpdatePermissionInput
> {
  constructor(@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>) {
    super(permissionRepository);
  }

  async permissions(args: PermissionsArgs): Promise<PermissionsObject> {
    return this.findAll(args);
  }

  async permission(args: PermissionArgs): Promise<Permission | undefined> {
    return this.findOne(args);
  }

  async craetePermission(args: CreatePermissionInput): Promise<Permission | undefined> {
    return this.permissionRepository.save({ ...args });
  }

  async updatePermission(id: number, args: UpdatePermissionInput): Promise<Permission | undefined> {
    return this.update(id, args);
  }

  async deletePermission(id: number): Promise<Permission | undefined> {
    return this.delete(id);
  }
}
