import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Role, Permission } from '@leaa/common/src/entrys';
import { RolesWithPaginationObject, CreateRoleInput, UpdateRoleInput } from '@leaa/common/src/dtos/role';
import { argsFormat, commonUpdate, commonDelete, isOneField, calcQbPageInfo, errorMessage } from '@leaa/api/src/utils';
import { IRolesArgs, IRoleArgs, IGqlCtx } from '@leaa/api/src/interfaces';
import { PermissionService } from '@leaa/api/src/modules/permission/permission.service';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';

const CLS_NAME = 'RoleService';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    private readonly permissionService: PermissionService,
    private readonly configService: ConfigService,
  ) {}

  async PLEASE_DONT_MODIFY_DEMO_DATA(id?: string, gqlCtx?: IGqlCtx): Promise<boolean> {
    if (this.configService.DEMO_MODE && !process.argv.includes('--nuke')) {
      if (!id) return true;

      const role = await this.role(id);

      if (role && role.slug && role.slug === 'admin') {
        throw errorMessage({ t: ['_error:pleaseDontModify'], gqlCtx });
      }
    }

    return true;
  }

  async roles(args: IRolesArgs): Promise<RolesWithPaginationObject | undefined> {
    const nextArgs = argsFormat(args);

    const PRIMARY_TABLE = 'roles';
    const qb = this.roleRepository.createQueryBuilder(PRIMARY_TABLE);
    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    // relations
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.permissions`, 'permissions');

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['name', 'slug'].forEach((key) => {
        qb.andWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // order
    if (nextArgs.orderBy && nextArgs.orderSort) {
      qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
    }

    return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async role(id: string, args?: IRoleArgs): Promise<Role | undefined> {
    if (!id) throw errorMessage({ t: ['_error:notFoundId'] });

    let nextArgs: IRoleArgs = {};

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

  async rolePermissionsByRoleIds(roleIds: string[]): Promise<Permission[] | undefined> {
    const roles = await this.roleRepository.findByIds(roleIds, { relations: ['permissions'] });

    let nextPermissions: Permission[] = [];

    roles.forEach((r) => {
      if (r.permissions && r.permissions.length > 0) {
        nextPermissions = nextPermissions.concat(r.permissions);
      }
    });

    return nextPermissions;
  }

  async roleSlugsToIds(slugs: string[]): Promise<string[]> {
    let roleIds: string[] = [];

    const roles = await this.roleRepository.find({
      slug: In(slugs),
    });

    if (roles && roles.length > 0) {
      roleIds = roles.map((p) => p.id);
    }

    return roleIds;
  }

  async createRole(args: CreateRoleInput): Promise<Role | undefined> {
    return this.roleRepository.save({ ...args });
  }

  async updateRole(id: string, args: UpdateRoleInput, gqlCtx?: IGqlCtx): Promise<Role | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id, gqlCtx);

    if (isOneField(args, 'status')) {
      return commonUpdate({ repository: this.roleRepository, CLS_NAME, id, args });
    }

    const relationArgs: { permissions?: Permission[] } = {};

    let permissionObjects;

    if (args.permissionIds && Array.isArray(args.permissionIds)) {
      permissionObjects = await this.permissionRepository.findByIds(args.permissionIds);
    }

    if (args.permissionSlugs && Array.isArray(args.permissionSlugs)) {
      const permissionId = await this.permissionService.permissionSlugsToIds(args.permissionSlugs);
      permissionObjects = await this.permissionRepository.findByIds(permissionId);
    }

    if (permissionObjects) {
      relationArgs.permissions = permissionObjects;
    } else {
      if (process.argv.includes('--nuke')) return undefined;

      throw errorMessage({ t: ['_error:notFound'], gqlCtx });
    }

    return commonUpdate({ repository: this.roleRepository, CLS_NAME, id, args, relation: relationArgs });
  }

  async deleteRole(id: string, gqlCtx?: IGqlCtx): Promise<Role | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id, gqlCtx);

    return commonDelete({ repository: this.roleRepository, CLS_NAME, id });
  }
}
