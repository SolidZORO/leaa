import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, In, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Setting } from '@leaa/common/src/entrys';
import {
  SettingsWithPaginationObject,
  CreateSettingInput,
  UpdateSettingInput,
  UpdateSettingsInput,
  SettingsObject,
} from '@leaa/common/src/dtos/setting';
import {
  argsFormat,
  logger,
  commonUpdate,
  commonDelete,
  isOneField,
  calcQbPageInfo,
  can,
  errorMsg,
} from '@leaa/api/src/utils';
import { ISettingsArgs, ISettingArgs, IGqlCtx } from '@leaa/api/src/interfaces';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { settingSeed } from '@leaa/api/src/modules/seed/seed.data';

const CLS_NAME = 'SettingService';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting) private readonly settingRepository: Repository<Setting>,
    private readonly configService: ConfigService,
  ) {}

  async PLEASE_DONT_MODIFY_DEMO_DATA(gqlCtx: IGqlCtx, id?: string): Promise<boolean> {
    const { t } = gqlCtx;

    if (this.configService.DEMO_MODE && !process.argv.includes('--nuke')) {
      if (!id) return true;

      const setting = await this.setting(gqlCtx, id);

      if (setting && setting.slug && settingSeed.map((seed) => seed.slug).includes(setting.slug)) {
        throw errorMsg(t('_error:pleaseDontModify'), { gqlCtx });
      }
    }

    return true;
  }

  async settings(gqlCtx: IGqlCtx, args: ISettingsArgs): Promise<SettingsWithPaginationObject> {
    const nextArgs = argsFormat(args, gqlCtx);

    const qb = this.settingRepository.createQueryBuilder();
    qb.select().orderBy({ sort: 'ASC' }).addOrderBy('id', 'ASC');

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['name', 'slug'].forEach((q) => {
        qb.orWhere(`${aliasName}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
      });
    }

    // can
    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'setting.list-read--private'))) {
      qb.andWhere('private = :private', { private: 0 });
    }

    return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async setting(gqlCtx: IGqlCtx, id: string, args?: ISettingArgs): Promise<Setting | undefined> {
    const { t } = gqlCtx;

    if (!id) throw errorMsg(t('_error:notFoundId'), { gqlCtx });

    let nextArgs: ISettingArgs = {};

    if (args) {
      nextArgs = args;
    }

    const whereQuery: { id: string; private?: number } = { id };

    // can
    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'setting.list-read--private'))) {
      whereQuery.private = 0;
    }

    const setting = this.settingRepository.findOne({
      ...nextArgs,
      where: whereQuery,
    });

    if (!setting) {
      const message = 'Not Found Setting';

      logger.warn(message, CLS_NAME);

      return undefined;
    }

    return setting;
  }

  async settingBySlug(gqlCtx: IGqlCtx, slug: string, args?: ISettingArgs): Promise<Setting | undefined> {
    const whereQuery: { slug: string; private?: number } = { slug };

    // can
    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'setting.list-read--private'))) {
      whereQuery.private = 0;
    }

    const setting = await this.settingRepository.findOne({ where: whereQuery });

    if (!setting) {
      const message = 'Not Found SettingBySlug';

      logger.warn(message, CLS_NAME);

      return undefined;
    }

    return this.setting(gqlCtx, setting.id, args);
  }

  async createSetting(gqlCtx: IGqlCtx, args: CreateSettingInput): Promise<Setting | undefined> {
    return this.settingRepository.save({ ...args });
  }

  async updateSetting(
    gqlCtx: IGqlCtx,
    id: string,
    args: UpdateSettingInput & FindOneOptions,
  ): Promise<Setting | undefined> {
    if (isOneField(args, 'status')) {
      return commonUpdate({ repository: this.settingRepository, CLS_NAME, id, args, gqlCtx });
    }

    return commonUpdate({ repository: this.settingRepository, CLS_NAME, id, args, gqlCtx });
  }

  async updateSettings(gqlCtx: IGqlCtx, settings: UpdateSettingsInput[]): Promise<SettingsObject> {
    const { t } = gqlCtx;

    const batchUpdate = settings.map(async (setting) => {
      await this.updateSetting(gqlCtx, setting.id, setting);
    });

    let items: Setting[] = [];

    await Promise.all(batchUpdate)
      .then(async () => {
        items = await this.settingRepository.find({ id: In(settings.map((s) => s.id)) });
      })
      .catch(() => {
        throw errorMsg(t('_error:updateItemFailed'), { gqlCtx });
      });

    return {
      items,
    };
  }

  async deleteSetting(gqlCtx: IGqlCtx, id: string): Promise<Setting | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(gqlCtx, id);

    return commonDelete({ repository: this.settingRepository, CLS_NAME, id, gqlCtx });
  }
}
