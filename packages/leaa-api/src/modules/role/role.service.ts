import { Injectable } from '@nestjs/common';
import { Repository, FindConditions, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Role, Permission } from '@leaa/common/entrys';
import { BaseService } from '@leaa/api/modules/base/base.service';
import { RolesArgs, RolesObject, RoleArgs, CreateRoleInput, UpdateRoleInput } from '@leaa/common/dtos/role';
import { formatUtil, loggerUtil } from '@leaa/api/utils';
import { permissions } from '@leaa/api/configs/permission.config';

@Injectable()
export class RoleService extends BaseService<Role, RolesArgs, RolesObject, RoleArgs, CreateRoleInput, UpdateRoleInput> {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
  ) {
    super(roleRepository);
  }

  async roles(args: RolesArgs & FindConditions<Role>): Promise<RolesObject> {
    const nextArgs = formatUtil.formatArgs(args);
    nextArgs.relations = ['permissions'];

    return this.findAll(nextArgs);
  }

  async role(args: RoleArgs & FindOneOptions<Role>): Promise<Role | undefined> {
    const nextArgs = args;
    nextArgs.relations = ['permissions'];

    return this.findOne(nextArgs);
  }

  async craeteRole(args: CreateRoleInput): Promise<Role | undefined> {
    return this.roleRepository.save({ ...args });
  }

  async updateRole(id: number, args: UpdateRoleInput): Promise<Role | undefined> {
    const prevItem = await this.roleRepository.findOne(id, { relations: ['permissions'] });

    if (!prevItem) {
      const message = `update item ${id} does not exist`;

      loggerUtil.warn(message, this.constructor.name);
      throw new Error(message);
    }

    const nextItem = {
      ...prevItem,
      ...args,
    };

    if (args.permissionIds) {
      const permissionObjects = await this.permissionRepository.findByIds(args.permissionIds);

      if (permissionObjects && permissionObjects.length && permissionObjects.length > 0) {
        nextItem.permissions = permissionObjects;
      } else {
        const message = `permissions error`;

        loggerUtil.warn(message, this.constructor.name);
        throw new Error(message);
      }
    }

    loggerUtil.updateLog({ id, prevItem, nextItem, constructorName: this.constructor.name });

    return this.roleRepository.save(nextItem);
  }

  async deleteRole(id: number): Promise<Role | undefined> {
    return this.delete(id);
  }
}
