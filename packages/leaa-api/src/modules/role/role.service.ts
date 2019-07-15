import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, In, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Role, Permission } from '@leaa/common/entrys';
import { BaseService } from '@leaa/api/modules/base/base.service';
import { RolesArgs, RolesWithPaginationObject, RoleArgs, CreateRoleInput, UpdateRoleInput } from '@leaa/common/dtos/role';
import { formatUtil, loggerUtil } from '@leaa/api/utils';
import { PermissionService } from '@leaa/api/modules/permission/permission.service';

const CONSTRUCTOR_NAME = 'RoleService';

@Injectable()
export class RoleService extends BaseService<Role, RolesArgs, RolesWithPaginationObject, RoleArgs, CreateRoleInput, UpdateRoleInput> {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    private readonly permissionService: PermissionService,
  ) {
    super(roleRepository);
  }

  async roles(args?: RolesArgs): Promise<RolesWithPaginationObject | undefined> {
    const nextArgs = args ? formatUtil.formatArgs(args) : {};

    let whereQuery = {};

    if (nextArgs.q) {
      whereQuery = { ...whereQuery, slug: Like(`%${nextArgs.q}%`) };
    }

    nextArgs.where = whereQuery;
    nextArgs.relations = [];

    const [items, total] = await this.roleRepository.findAndCount(nextArgs);

    return {
      items,
      total,
      page: nextArgs.page || 1,
      pageSize: nextArgs.pageSize || 30,
    };
  }

  async role(id: number, args?: FindOneOptions<Role>): Promise<Role | undefined> {
    let nextArgs: FindOneOptions<Role> = {};

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['permissions'];
    }

    return this.findOne(id, nextArgs);
  }

  async roleBySlug(slug: string): Promise<Role | undefined> {
    return this.roleRepository.findOne({
      relations: ['permissions'],
      where: { slug },
    });
  }

  async rolePermissionsByRoleIds(roleIds: number[]): Promise<Permission[] | undefined> {
    const roles = await this.roleRepository.findByIds(roleIds, { relations: ['permissions'] });

    let nextPermissions: Permission[] = [];

    roles.forEach(r => {
      if (r.permissions && r.permissions.length > 0) {
        nextPermissions = nextPermissions.concat(r.permissions);
      }
    });

    return nextPermissions;
  }

  async roleSlugsToIds(slugs: string[]): Promise<number[]> {
    let roleIds: number[] = [];

    const roles = await this.roleRepository.find({
      slug: In(slugs),
    });

    if (roles && roles.length > 0) {
      roleIds = roles.map(p => p.id);
    }

    return roleIds;
  }

  async craeteRole(args: CreateRoleInput): Promise<Role | undefined> {
    return this.roleRepository.save({ ...args });
  }

  async updateRole(id: number, args: UpdateRoleInput): Promise<Role | undefined> {
    const relationArgs: { permissions?: Permission[] } = {};

    let permissionObjects;

    if (args.permissionIds) {
      permissionObjects = await this.permissionRepository.findByIds(args.permissionIds);
    }

    if (args.permissionSlugs) {
      const permissionId = await this.permissionService.permissionSlugsToIds(args.permissionSlugs);
      permissionObjects = await this.permissionRepository.findByIds(permissionId);
    }

    if (permissionObjects) {
      relationArgs.permissions = permissionObjects;
    } else {
      const message = `permissions error`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    return this.update(id, args, relationArgs);
  }

  async deleteRole(id: number): Promise<Role | undefined> {
    return this.delete(id);
  }
}
