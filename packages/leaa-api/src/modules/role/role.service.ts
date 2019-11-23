import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, In, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Role, Permission } from '@leaa/common/src/entrys';
import { RolesArgs, RolesWithPaginationObject, CreateRoleInput, UpdateRoleInput } from '@leaa/common/src/dtos/role';
import { formatUtil, loggerUtil, curdUtil, paginationUtil } from '@leaa/api/src/utils';
import { PermissionService } from '@leaa/api/src/modules/permission/permission.service';

const CONSTRUCTOR_NAME = 'RoleService';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    private readonly permissionService: PermissionService,
  ) {}

  async roles(args: RolesArgs): Promise<RolesWithPaginationObject | undefined> {
    const nextArgs = formatUtil.formatArgs(args);

    const qb = getRepository(Role).createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['name', 'slug'].forEach(q => {
        qb.orWhere(`${aliasName}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
      });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async role(id: number, args?: FindOneOptions<Role>): Promise<Role | undefined> {
    let nextArgs: FindOneOptions<Role> = {};

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['permissions'];
    }

    return this.roleRepository.findOne(id, nextArgs);
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

  async createRole(args: CreateRoleInput): Promise<Role | undefined> {
    return this.roleRepository.save({ ...args });
  }

  async updateRole(id: number, args: UpdateRoleInput): Promise<Role | undefined> {
    const relationArgs: { permissions?: Permission[] } = {};

    let permissionObjects;

    if (typeof args.permissionIds !== 'undefined') {
      permissionObjects = await this.permissionRepository.findByIds(args.permissionIds);
    }

    if (typeof args.permissionSlugs !== 'undefined') {
      const permissionId = await this.permissionService.permissionSlugsToIds(args.permissionSlugs);
      permissionObjects = await this.permissionRepository.findByIds(permissionId);
    }

    if (permissionObjects) {
      relationArgs.permissions = permissionObjects;
    } else {
      const message = 'permissions error';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    return curdUtil.commonUpdate(this.roleRepository, CONSTRUCTOR_NAME, id, args, relationArgs);
  }

  async deleteRole(id: number): Promise<Role | undefined> {
    // default role DONT
    if (id <= 3) {
      throw Error('PLEASE DONT');
    }

    return curdUtil.commonDelete(this.roleRepository, CONSTRUCTOR_NAME, id);
  }
}
