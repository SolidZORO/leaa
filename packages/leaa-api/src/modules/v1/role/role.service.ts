import { Repository, In } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { Injectable } from '@nestjs/common';

import { Role, User, Permission } from '@leaa/common/src/entrys';
import { RoleUpdateOneReq } from '@leaa/common/src/dtos/role';

// const CLS_NAME = 'RoleService';

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepo: Repository<Permission>,
  ) {
    super(roleRepo);
  }

  async updateOne(req: CrudRequest, dto: RoleUpdateOneReq): Promise<Role> {
    const { allowParamsOverride, returnShallow } = req.options.routes?.updateOneBase || {};

    const paramsFilters = this.getParamFilters(req.parsed);
    const found = await this.getOneOrFail(req, returnShallow);
    const toSave = !allowParamsOverride
      ? { ...found, ...dto, ...paramsFilters, ...req.parsed.authPersist }
      : { ...found, ...dto, ...req.parsed.authPersist };

    if (dto.permissionIds && Array.isArray(dto.permissionIds)) {
      toSave.permissions = await this.permissionRepo.findByIds(dto.permissionIds);
    }

    const updated = await this.repo.save(plainToClass(this.entityType, toSave));

    if (returnShallow) return updated;

    req.parsed.paramsFilter.forEach((filter) => {
      // eslint-disable-next-line no-param-reassign
      filter.value = (updated as any)[filter.field];
    });

    return this.getOneOrFail(req);
  }

  //
  //

  async getOneBySlug(slug: string): Promise<Role | undefined> {
    return this.roleRepo.findOne({
      relations: ['permissions'],
      where: { slug },
    });
  }

  async getManyPermissionsByRoleIds(roleIds: string[]): Promise<Permission[] | undefined> {
    const roles = await this.roleRepo.findByIds(roleIds, { relations: ['permissions'] });

    let nextPermissions: Permission[] = [];

    roles.forEach((r) => {
      if (r.permissions && r.permissions.length > 0) {
        nextPermissions = nextPermissions.concat(r.permissions);
      }
    });

    return nextPermissions;
  }

  async transSlugsToIds(slugs: string[]): Promise<string[]> {
    let roleIds: string[] = [];

    const roles = await this.roleRepo.find({
      slug: In(slugs),
    });

    if (roles && roles.length > 0) roleIds = roles.map((p) => p.id);

    return roleIds;
  }

  async getPermissionsByUser(user: User | undefined): Promise<Permission[] | undefined> {
    if (!user || !user.roles) return undefined;

    const roleIds = user.roles.map((r) => r.id);
    const permissions = await this.getManyPermissionsByRoleIds(roleIds);
    if (!permissions) return undefined;

    return permissions;
  }

  async getFlatPermissionsByUser(user: User | undefined): Promise<string[] | undefined> {
    const permissions = await this.getPermissionsByUser(user);

    if (!permissions) return undefined;

    return [...new Set(permissions.map((permission) => permission.slug))];
  }
}
