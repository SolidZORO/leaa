import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, In, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Permission, User } from '@leaa/common/src/entrys';
import {
  PermissionsArgs,
  PermissionsWithPaginationObject,
  PermissionArgs,
  CreatePermissionInput,
  UpdatePermissionInput,
} from '@leaa/common/src/dtos/permission';
import { formatUtil, curdUtil, paginationUtil, errorUtil } from '@leaa/api/src/utils';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';

type IPermissionsArgs = PermissionsArgs & FindOneOptions<Permission>;
type IPermissionArgs = PermissionArgs & FindOneOptions<Permission>;

const CLS_NAME = 'PermissionService';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    private readonly configService: ConfigService,
  ) {}

  async permissions(args: IPermissionsArgs): Promise<PermissionsWithPaginationObject> {
    const nextArgs: IPermissionsArgs = formatUtil.formatArgs(args);

    const qb = this.permissionRepository.createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'created_at', nextArgs.orderSort);

    // q
    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['name', 'slug'].forEach(key => {
        qb.orWhere(`${aliasName}.${key} LIKE :${key}`, { [key]: `%${nextArgs.q}%` });
      });
    }

    const pageInfo = await paginationUtil.calcQueryBuilderPageInfo({
      qb,
      page: nextArgs.page,
      pageSize: nextArgs.pageSize,
    });

    return {
      ...pageInfo,
      items: pageInfo.items.map(i => ({
        ...i,
        slugGroup: i.slug.split('.')[0],
      })),
    };
  }

  async permission(id: number, args?: IPermissionArgs): Promise<Permission | undefined> {
    let nextArgs: IPermissionArgs = {};
    if (args) nextArgs = args;

    return this.permissionRepository.findOne(id, nextArgs);
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
    if (this.configService.DEMO_MODE && !process.argv.includes('--nuke') && id <= 93) {
      // eslint-disable-next-line no-param-reassign
      delete args.slug;
    }

    // prettier-ignore
    // eslint-disable-next-line max-len
    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.permissionRepository, CLS_NAME, id, args);

    return curdUtil.commonUpdate(this.permissionRepository, CLS_NAME, id, args);
  }

  async deletePermission(id: number, user?: User): Promise<Permission | undefined> {
    if (this.configService.DEMO_MODE && !process.argv.includes('--nuke') && id <= 93) {
      return errorUtil.ERROR({ error: 'Default Permission, PLEASE DONT', user });
    }

    return curdUtil.commonDelete(this.permissionRepository, CLS_NAME, id);
  }
}
