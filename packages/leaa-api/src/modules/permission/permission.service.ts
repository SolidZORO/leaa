import { Injectable } from '@nestjs/common';
import { Repository, In, Like } from 'typeorm';
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
import { formatUtil } from '@leaa/api/utils';

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
    const nextArgs = formatUtil.formatArgs(args);

    let whereQuery = {};

    if (nextArgs.q) {
      whereQuery = { ...whereQuery, slug: Like(`%${nextArgs.q}%`) };
    }

    nextArgs.where = whereQuery;

    const [items, total] = await this.permissionRepository.findAndCount(nextArgs);

    return {
      items: items.map(i => ({
        ...i,
        slugGroup: i.slug.split('.')[0],
      })),
      total,
      page: nextArgs.page || 1,
      pageSize: nextArgs.pageSize || 30,
    };
  }

  async permission(id: number, args?: PermissionArgs): Promise<Permission | undefined> {
    return this.findOne(id, args);
  }

  async permissionSlugsToIds(slugs: string[]): Promise<number[]> {
    let permissionIds: number[] = [];

    const permissions = await this.permissionRepository.find({
      slug: In(slugs),
    });

    if (permissions && permissions.length > 0) {
      permissionIds = permissions.map(p => p.id);
    }

    return permissionIds;
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
