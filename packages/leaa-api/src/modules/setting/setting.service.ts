import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getRepository, In, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Setting } from '@leaa/common/src/entrys';
import {
  SettingsArgs,
  SettingsWithPaginationObject,
  SettingArgs,
  CreateSettingInput,
  UpdateSettingInput,
  UpdateSettingsInput,
  SettingsObject,
} from '@leaa/common/src/dtos/setting';
import { formatUtil, loggerUtil } from '@leaa/api/src/utils';

const CONSTRUCTOR_NAME = 'SettingService';

@Injectable()
export class SettingService {
  constructor(@InjectRepository(Setting) private readonly settingRepository: Repository<Setting>) {}

  async settings(args: SettingsArgs): Promise<SettingsWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    const qb = getRepository(Setting).createQueryBuilder();
    qb.select();
    qb.orderBy({ sort: 'ASC' }).addOrderBy('created_at', 'ASC');

    if (nextArgs.q) {
      const qbAlias = new SelectQueryBuilder(qb).alias;

      ['name', 'slug'].forEach(q => {
        qb.andWhere(`${qbAlias}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
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

  async setting(id: number, args?: SettingArgs & FindOneOptions<Setting>): Promise<Setting | undefined> {
    let nextArgs: FindOneOptions<Setting> = {};

    if (args) {
      nextArgs = args;
    }

    const whereQuery: { id: number; status?: number } = { id };

    const setting = this.settingRepository.findOne({
      ...nextArgs,
      where: whereQuery,
    });

    if (!setting) {
      const message = 'not found setting';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return undefined;
    }

    return setting;
  }

  async settingBySlug(slug: string, args?: SettingArgs & FindOneOptions<Setting>): Promise<Setting | undefined> {
    const setting = await this.settingRepository.findOne({ where: { slug } });

    if (!setting) {
      const message = 'not found settingBySlug';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return undefined;
    }

    return this.setting(setting.id, args);
  }

  async createSetting(args: CreateSettingInput): Promise<Setting | undefined> {
    return this.settingRepository.save({ ...args });
  }

  async updateSetting(id: number, args: UpdateSettingInput & FindOneOptions): Promise<Setting | undefined> {
    if (!args) {
      const message = `update item ${id} args does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return undefined;
    }

    let prevItem = await this.settingRepository.findOne(id);

    if (!prevItem) {
      const message = `update item ${id} does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return undefined;
    }

    prevItem = {
      ...prevItem,
      ...args,
    };

    const nextItem = await this.settingRepository.save(prevItem);

    loggerUtil.updateLog({ id, prevItem, nextItem, constructorName: CONSTRUCTOR_NAME });

    return nextItem;
  }

  async updateSettings(settings: UpdateSettingsInput[]): Promise<SettingsObject> {
    const batchUpdate = settings.map(async setting => {
      await this.updateSetting(setting.id, setting);
    });

    let items: Setting[] = [];

    await Promise.all(batchUpdate)
      .then(async () => {
        items = await this.settingRepository.find({ id: In(settings.map(s => s.id)) });
      })
      .catch(() => {
        loggerUtil.error(`updateSettings faild, args: ${JSON.stringify(settings)}`, CONSTRUCTOR_NAME);
      });

    return {
      items,
    };
  }

  async deleteSetting(id: number): Promise<Setting | undefined> {
    const prevId = id;
    const prevItem = await this.settingRepository.findOne(id);

    if (!prevItem) {
      const message = `delete item ${id} does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return undefined;
    }

    const nextItem = await this.settingRepository.remove(prevItem);

    if (!nextItem) {
      const message = `delete item ${id} faild`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return undefined;
    }

    loggerUtil.warn(`delete item ${id} successful: ${JSON.stringify(nextItem)}\n\n`, CONSTRUCTOR_NAME);

    return {
      ...nextItem,
      id: prevId,
    };
  }
}
