import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getRepository, In, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Setting, User } from '@leaa/common/src/entrys';
import {
  SettingsArgs,
  SettingsWithPaginationObject,
  SettingArgs,
  CreateSettingInput,
  UpdateSettingInput,
  UpdateSettingsInput,
  SettingsObject,
} from '@leaa/common/src/dtos/setting';
import { formatUtil, loggerUtil, curdUtil, paginationUtil, errorUtil, authUtil } from '@leaa/api/src/utils';

const CONSTRUCTOR_NAME = 'SettingService';

@Injectable()
export class SettingService {
  constructor(@InjectRepository(Setting) private readonly settingRepository: Repository<Setting>) {}

  async settings(args: SettingsArgs, user?: User): Promise<SettingsWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    const qb = getRepository(Setting).createQueryBuilder();
    qb.select()
      .orderBy({ sort: 'ASC' })
      .addOrderBy('id', 'ASC');

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['name', 'slug'].forEach(q => {
        qb.orWhere(`${aliasName}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
      });
    }

    // can
    if (!(user && authUtil.can(user, 'setting.list-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
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
    return curdUtil.commonUpdate(this.settingRepository, CONSTRUCTOR_NAME, id, args);
  }

  async updateSettings(settings: UpdateSettingsInput[], user?: User): Promise<SettingsObject> {
    const batchUpdate = settings.map(async setting => {
      await this.updateSetting(setting.id, setting);
    });

    let items: Setting[] = [];

    await Promise.all(batchUpdate)
      .then(async () => {
        items = await this.settingRepository.find({ id: In(settings.map(s => s.id)) });
      })
      .catch(() => {
        return errorUtil.ERROR({ error: `updateSettings faild, args: ${JSON.stringify(settings)}`, user });
      });

    return {
      items,
    };
  }

  async deleteSetting(id: number, user?: User): Promise<Setting | undefined> {
    // default setting DONT
    if (id <= 5) {
      return errorUtil.ERROR({ error: 'default setting PLEASE DONT', user });
    }

    return curdUtil.commonDelete(this.settingRepository, CONSTRUCTOR_NAME, id);
  }
}
