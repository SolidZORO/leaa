import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Role, Permission, Article } from '@leaa/common/src/entrys';
import { RolesWithPaginationObject, CreateRoleInput, UpdateRoleInput } from '@leaa/common/src/dtos/role';
import { argsFormat, commonUpdate, commonDelete, isOneField, calcQbPageInfo, errorMsg } from '@leaa/api/src/utils';
import { IRolesArgs, IRoleArgs, IGqlCtx } from '@leaa/api/src/interfaces';
import { PermissionService } from '@leaa/api/src/modules/permission/permission.service';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ParsedRequest, CrudRequest, ParsedBody } from '@nestjsx/crud';
import { UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { plainToClass } from 'class-transformer';

const CLS_NAME = 'RoleService';

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepo: Repository<Permission>,
    private readonly permissionService: PermissionService,
    private readonly configService: ConfigService,
  ) {
    super(roleRepo);
  }

  async updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: UpdateRoleInput): Promise<Role> {
    const { allowParamsOverride, returnShallow } = req.options.routes?.updateOneBase || {};

    const paramsFilters = this.getParamFilters(req.parsed);
    const found = await this.getOneOrFail(req, returnShallow);
    const toSave = !allowParamsOverride
      ? { ...found, ...dto, ...paramsFilters, ...req.parsed.authPersist }
      : { ...found, ...dto, ...req.parsed.authPersist };

    let permissionObjects;

    if (dto.permissionIds && Array.isArray(dto.permissionIds)) {
      permissionObjects = await this.permissionRepo.findByIds(dto.permissionIds);
    }

    // if (dto.permissionSlugs && Array.isArray(dto.permissionSlugs)) {
    //   const permissionId = await this.permissionService.permissionSlugsToIds(dto.permissionSlugs);
    //   permissionObjects = await this.permissionRepo.findByIds(permissionId);
    // }

    if (permissionObjects) {
      toSave.permissions = permissionObjects;
    } else {
      throw errorMsg('_error:notFound');
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
  // async PLEASE_DONT_MODIFY_DEMO_DATA(id?: string): Promise<boolean> {
  //   // const { t } = gqlCtx;
  //
  //   if (this.configService.DEMO_MODE && !process.argv.includes('--nuke')) {
  //     if (!id) return true;
  //
  //     const role = await this.role(id);
  //
  //     if (role && role.slug && role.slug === 'admin') {
  //       throw errorMsg('_error:pleaseDontModify');
  //     }
  //   }
  //
  //   return true;
  // }
  //
  // async roles(args: IRolesArgs): Promise<RolesWithPaginationObject | undefined> {
  //   const nextArgs = argsFormat(args);
  //
  //   const PRIMARY_TABLE = 'roles';
  //   const qb = this.roleRepo.createQueryBuilder(PRIMARY_TABLE);
  //   qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);
  //
  //   // relations
  //   qb.leftJoinAndSelect(`${PRIMARY_TABLE}.permissions`, 'permissions');
  //
  //   // q
  //   if (nextArgs.q) {
  //     const qLike = `%${nextArgs.q}%`;
  //
  //     ['name', 'slug'].forEach((key) => {
  //       qb.andWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
  //     });
  //   }
  //
  //   // order
  //   if (nextArgs.orderBy && nextArgs.orderSort) {
  //     qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
  //   }
  //
  //   return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  // }
  //
  // async role(id: string, args?: IRoleArgs): Promise<Role | undefined> {
  //   // const { t } = gqlCtx;
  //
  //   if (!id) throw errorMsg('_error:notFoundId');
  //
  //   let nextArgs: IRoleArgs = {};
  //
  //   if (args) {
  //     nextArgs = args;
  //     nextArgs.relations = ['permissions'];
  //   }
  //
  //   return this.roleRepo.findOne(id, nextArgs);
  // }
  //
  // async roleBySlug(slug: string): Promise<Role | undefined> {
  //   return this.roleRepo.findOne({
  //     relations: ['permissions'],
  //     where: { slug },
  //   });
  // }
  //
  async rolePermissionsByRoleIds(roleIds: string[]): Promise<Permission[] | undefined> {
    const roles = await this.roleRepo.findByIds(roleIds, { relations: ['permissions'] });

    let nextPermissions: Permission[] = [];

    roles.forEach((r) => {
      if (r.permissions && r.permissions.length > 0) {
        nextPermissions = nextPermissions.concat(r.permissions);
      }
    });

    return nextPermissions;
  }
  //
  // async roleSlugsToIds(slugs: string[]): Promise<string[]> {
  //   let roleIds: string[] = [];
  //
  //   const roles = await this.roleRepo.find({
  //     slug: In(slugs),
  //   });
  //
  //   if (roles && roles.length > 0) {
  //     roleIds = roles.map((p) => p.id);
  //   }
  //
  //   return roleIds;
  // }
  //
  // async createRole(args: CreateRoleInput): Promise<Role | undefined> {
  //   return this.roleRepo.save({ ...args });
  // }
  //
  // async updateRole(id: string, args: UpdateRoleInput): Promise<Role | undefined> {
  //   // const { t } = gqlCtx;
  //
  //   if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id);
  //
  //   if (isOneField(args, 'status')) {
  //     return commonUpdate({ repository: this.roleRepo, CLS_NAME, id, args });
  //   }
  //
  //   const relationArgs: { permissions?: Permission[] } = {};
  //
  //   let permissionObjects;
  //
  //   if (args.permissionIds && Array.isArray(args.permissionIds)) {
  //     permissionObjects = await this.permissionRepo.findByIds(args.permissionIds);
  //   }
  //
  //   if (args.permissionSlugs && Array.isArray(args.permissionSlugs)) {
  //     const permissionId = await this.permissionService.permissionSlugsToIds(args.permissionSlugs);
  //     permissionObjects = await this.permissionRepo.findByIds(permissionId);
  //   }
  //
  //   if (permissionObjects) {
  //     relationArgs.permissions = permissionObjects;
  //   } else {
  //     if (process.argv.includes('--nuke')) return undefined;
  //
  //     throw errorMsg('_error:notFound');
  //   }
  //
  //   return commonUpdate({ repository: this.roleRepo, CLS_NAME, id, args, relation: relationArgs });
  // }
  //
  // async deleteRole(id: string): Promise<Role | undefined> {
  //   if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id);
  //
  //   return commonDelete({ repository: this.roleRepo, CLS_NAME, id });
  // }
}
