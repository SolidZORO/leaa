import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Setting, User } from '@leaa/common/entrys';
import {
  SettingsArgs,
  SettingsWithPaginationObject,
  SettingArgs,
  CreateSettingInput,
  UpdateSettingInput,
} from '@leaa/common/dtos/setting';
import { BaseService } from '@leaa/api/modules/base/base.service';
import { formatUtil } from '@leaa/api/utils';

const CONSTRUCTOR_NAME = 'SettingService';

@Injectable()
export class SettingService extends BaseService<
  Setting,
  SettingsArgs,
  SettingsWithPaginationObject,
  SettingArgs,
  CreateSettingInput,
  UpdateSettingInput
> {
  constructor(@InjectRepository(Setting) private readonly settingRepository: Repository<Setting>) {
    super(settingRepository);
  }

  async settings(args: SettingsArgs, user?: User): Promise<SettingsWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    const qb = getRepository(Setting).createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'created_at', nextArgs.orderSort);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['name', 'slug'].forEach(q => {
        qb.andWhere(`${aliasName}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
      });
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page: nextArgs.page || 1,
      pageSize: nextArgs.pageSize || 30,
    };
  }

  async setting(id: number, args?: SettingArgs & FindOneOptions<Setting>, user?: User): Promise<Setting | undefined> {
    let nextArgs: FindOneOptions<Setting> = {};

    if (args) {
      nextArgs = args;
    }

    const whereQuery: { id: number; status?: number } = { id };

    return this.settingRepository.findOne({
      ...nextArgs,
      where: whereQuery,
    });
  }

  async craeteSetting(args: CreateSettingInput): Promise<Setting | undefined> {
    return this.settingRepository.save({ ...args });
  }

  async updateSetting(id: number, args: UpdateSettingInput): Promise<Setting | undefined> {
    return this.update(id, args);
  }

  async deleteSetting(id: number): Promise<Setting | undefined> {
    return this.delete(id);
  }
}
