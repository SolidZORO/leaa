import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Permission } from '@leaa/api/src/entrys';
import { Repository, In } from 'typeorm';

export interface ITransIdsToEntrys {
  dto: any;
  toSave: any;
  idName: any;
  sName: string;
  repo: any;
}

@Injectable()
export class PermissionService extends TypeOrmCrudService<Permission> {
  constructor(@InjectRepository(Permission) private readonly permissionRepo: Repository<Permission>) {
    super(permissionRepo);
  }

  async transSlugsToIds(slugs: string[]): Promise<string[]> {
    let permissionIds: string[] = [];

    const permissions = await this.permissionRepo.find({
      slug: In(slugs),
    });

    if (permissions && permissions.length > 0) {
      permissionIds = permissions.map((p) => p.id);
    }

    return permissionIds;
  }
}
