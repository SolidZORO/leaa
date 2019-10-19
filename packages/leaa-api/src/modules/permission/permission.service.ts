import { Injectable } from '@nestjs/common';
import { Repository, In, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Permission } from '@leaa/common/src/entrys';
import {
  PermissionsArgs,
  PermissionsWithPaginationObject,
  PermissionArgs,
  CreatePermissionInput,
  UpdatePermissionInput,
} from '@leaa/common/src/dtos/permission';
import { formatUtil, curdUtil } from '@leaa/api/src/utils';

const CONSTRUCTOR_NAME = 'PermissionService';

@Injectable()
export class PermissionService {
  constructor(@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>) {}

  async permissions(args: PermissionsArgs): Promise<PermissionsWithPaginationObject> {
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
    return this.permissionRepository.findOne(id, args);
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

  async createPermission(args: CreatePermissionInput): Promise<Permission | undefined> {
    return this.permissionRepository.save({ ...args });
  }

  async updatePermission(id: number, args: UpdatePermissionInput): Promise<Permission | undefined> {
    return curdUtil.commonUpdate(this.permissionRepository, CONSTRUCTOR_NAME, id, args);
  }

  async deletePermission(id: number): Promise<Permission | undefined> {
    // default role DONT
    if (id <= 21) {
      throw Error('PLEASE DONT');
    }

    return curdUtil.commonDelete(this.permissionRepository, CONSTRUCTOR_NAME, id);
  }
}
