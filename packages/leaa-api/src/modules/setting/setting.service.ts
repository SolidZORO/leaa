import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getRepository, In, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Setting, User } from '@leaa/common/entrys';
import {
  SettingsArgs,
  SettingsWithPaginationObject,
  SettingArgs,
  CreateSettingInput,
  UpdateSettingInput,
  UpdateSettingsInput,
  SettingsObject,
} from '@leaa/common/dtos/setting';
import { BaseService } from '@leaa/api/modules/base/base.service';
import { formatUtil, loggerUtil } from '@leaa/api/utils';

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
    qb.select();
    qb.orderBy({ sort: 'ASC' }).addOrderBy('created_at', 'ASC');

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

  async settingBySlug(
    slug: string,
    args?: SettingArgs & FindOneOptions<Setting>,
    user?: User,
  ): Promise<Setting | undefined> {
    const setting = await this.settingRepository.findOne({ where: { slug } });

    if (!setting) {
      const message = 'not found setting';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return undefined;
    }

    return this.setting(setting.id, args, user);
  }

  async craeteSetting(args: CreateSettingInput): Promise<Setting | undefined> {
    return this.settingRepository.save({ ...args });
  }

  async updateSetting(id: number, args: UpdateSettingInput): Promise<Setting | undefined> {
    return this.update(id, args);
  }

  async updateSettings(settings: UpdateSettingsInput[]): Promise<SettingsObject> {
    const batchUpdate = settings.map(async setting => {
      await this.settingRepository.update({ id: setting.id }, { value: setting.value });
    });

    let items: Setting[] = [];

    await Promise.all(batchUpdate)
      .then(async () => {
        loggerUtil.log(JSON.stringify(settings), CONSTRUCTOR_NAME);

        items = await this.settingRepository.find({ id: In(settings.map(s => s.id)) });
      })
      .catch(() => {
        loggerUtil.error(JSON.stringify(settings), CONSTRUCTOR_NAME);
      });

    return {
      items,
    };
  }

  async deleteSetting(id: number): Promise<Setting | undefined> {
    return this.delete(id);
  }
}
