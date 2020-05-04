import fs from 'fs';
import mkdirp from 'mkdirp';
import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Division } from '@leaa/common/src/entrys';
import {
  DivisionsWithPaginationObject,
  UpdateDivisionInput,
  CreateDivisionInput,
} from '@leaa/common/src/dtos/division';
import { argsUtil, paginationUtil, curdUtil, loggerUtil, msgUtil } from '@leaa/api/src/utils';
import { IDivisionSource } from '@leaa/common/src/interfaces';
import { SyncTagsToFileObject } from '@leaa/common/src/dtos/tag';
import { divisionConfig } from '@leaa/api/src/configs';
import { IDivisionsArgs, IDivisionArgs } from '@leaa/api/src/interfaces';

const CLS_NAME = 'DivisionService';

@Injectable()
export class DivisionService {
  constructor(@InjectRepository(Division) private readonly divisionRepository: Repository<Division>) {}

  async divisions(args: IDivisionsArgs): Promise<DivisionsWithPaginationObject> {
    const nextArgs: IDivisionsArgs = argsUtil.format(args);

    const PRIMARY_TABLE = 'divisions';
    const qb = await this.divisionRepository.createQueryBuilder(PRIMARY_TABLE);

    return paginationUtil.calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async divisionsMapping(): Promise<string | undefined> {
    if (!fs.existsSync(divisionConfig.DIVISION_OF_CHINA_FILE_PATH)) {
      await this.syncDivisionToFile();
    }

    return fs.readFileSync(divisionConfig.DIVISION_OF_CHINA_FILE_PATH, 'utf8');
  }

  async divisionsTree(): Promise<string | undefined | void> {
    const [items] = await this.divisionRepository.findAndCount();

    return this.formatDivision(items, 'tree');
  }

  async division(id: string, args?: IDivisionArgs): Promise<Division | undefined> {
    if (!id) throw msgUtil.error({ t: ['_error:notFoundId'] });

    let nextArgs: IDivisionArgs = {};

    if (args) {
      nextArgs = args;
    }

    return this.divisionRepository.findOne(id, nextArgs);
  }

  formatDivision(items: any[], type: 'json' | 'tree' = 'json'): string | void {
    const provinces = items.filter((v) => v.code && !v.province_code && !v.city_code);
    const cities = items.filter((v) => v.code && v.province_code && !v.city_code);
    const areas = items.filter((v) => v.code && v.province_code && v.city_code);

    /* eslint-disable no-return-assign */
    /* eslint-disable no-param-reassign */
    provinces.forEach((pv) => {
      pv.value = type === 'json' ? pv.name : undefined;
      pv.title = type === 'tree' ? pv.name : undefined;
      pv.children = [];
    });

    cities.forEach((cv) => {
      cv.value = type === 'json' ? cv.name : undefined;
      cv.title = type === 'tree' ? cv.name : undefined;
      cv.children = [];
    });

    areas.forEach((av) => {
      const city = cities.find((c) => c.code === av.city_code);

      if (city && city.children) {
        city.children.push({
          value: type === 'json' ? av.name : undefined,
          title: type === 'tree' ? av.name : undefined,
          id: type === 'tree' ? av.id : undefined,
          province_code: type === 'tree' ? av.province_code : undefined,
          city_code: type === 'tree' ? av.city_code : undefined,
          code: type === 'tree' ? av.code : undefined,
        });
      }
    });

    cities.forEach((cv) => {
      const province = provinces.find((p) => p.code === cv.province_code);

      if (province && province.children) {
        province.children.push({
          children: cv.children,
          value: type === 'json' ? cv.name : undefined,
          title: type === 'tree' ? cv.name : undefined,
          id: type === 'tree' ? cv.id : undefined,
          province_code: type === 'tree' ? cv.province_code : undefined,
          code: type === 'tree' ? cv.code : undefined,
        });
      }
    });

    if (type === 'json') {
      provinces.forEach((pv) => {
        delete pv.code;
        delete pv.city_code;
        delete pv.province_code;
      });

      return fs.writeFileSync(divisionConfig.DIVISION_OF_CHINA_FILE_PATH, JSON.stringify(provinces));
    }

    return JSON.stringify(provinces);
  }

  async syncDivisionToFile(): Promise<SyncTagsToFileObject> {
    if (!fs.existsSync(divisionConfig.DIVISION_OF_CHINA_FILE_PATH)) {
      loggerUtil.log(`syncDivisionToFile, not exists ${divisionConfig.DIVISION_OF_CHINA_FILE_PATH}`, CLS_NAME);

      try {
        mkdirp.sync(divisionConfig.DIVISION_DIR);
      } catch (err) {
        loggerUtil.error(JSON.stringify(err), CLS_NAME);
        throw Error(err.message);
      }
    }

    let sqlRunResultMessage = 'Skip insert database';

    const divisionCount = await this.divisionRepository.count({ select: ['code'] });

    if (!divisionCount) {
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */

      const DIVISION_SOURCE_DIR = `${divisionConfig.DIVISION_DIR}/source/china`;

      // prettier-ignore
      // eslint-disable-next-line max-len
      const provinces: IDivisionSource[] = await JSON.parse(fs.readFileSync(`${DIVISION_SOURCE_DIR}/provinces.json`, 'utf8'));
      const cities: IDivisionSource[] = await JSON.parse(fs.readFileSync(`${DIVISION_SOURCE_DIR}/cities.json`, 'utf8'));
      const areas: IDivisionSource[] = await JSON.parse(fs.readFileSync(`${DIVISION_SOURCE_DIR}/areas.json`, 'utf8'));

      let sqlBody = '';

      provinces.forEach((v) => {
        sqlBody += `('${uuid.v4()}', ${Number(v.code)}, '${v.name}', NULL, NULL), `;
      });

      cities.forEach((v) => {
        sqlBody += `('${uuid.v4()}', ${Number(v.code)}, '${v.name}', ${Number(v.provinceCode)}, NULL), `;
      });

      areas.forEach((v, i) => {
        sqlBody += `('${uuid.v4()}', ${Number(v.code)}, '${v.name}', ${Number(v.provinceCode)}, ${Number(v.cityCode)})${
          i === areas.length - 1 ? ';' : ','
        } `;
      });

      const insertSql = `
      INSERT INTO \`divisions\` (\`id\`, \`code\`, \`name\`, \`province_code\`, \`city_code\`) VALUES ${sqlBody}
    `;

      const sqlRunResult = await getConnection().query(insertSql);

      sqlRunResultMessage = sqlRunResult.message;

      loggerUtil.log(`building division of china... ${sqlRunResultMessage}`, CLS_NAME);
    }

    const [items] = await this.divisionRepository.findAndCount({
      select: ['id', 'code', 'name', 'province_code', 'city_code'],
    });

    await this.formatDivision(items, 'json');

    return {
      status: `Synced. ${sqlRunResultMessage}.`,
    };
  }

  async createDivision(args: CreateDivisionInput): Promise<Division | undefined> {
    const relationArgs = {};
    const result = await this.divisionRepository.save({ ...args, ...relationArgs });

    if (result) {
      await this.syncDivisionToFile();
    }

    return result;
  }

  async updateDivision(id: string, args: UpdateDivisionInput): Promise<Division | undefined> {
    if (curdUtil.isOneField(args, 'status')) {
      return curdUtil.commonUpdate({ repository: this.divisionRepository, CLS_NAME, id, args });
    }

    const nextArgs = {
      ...args,
    };

    const result = await curdUtil.commonUpdate({ repository: this.divisionRepository, CLS_NAME, id, args: nextArgs });

    if (result) {
      await this.syncDivisionToFile();
    }

    return result;
  }

  async deleteDivision(id: string): Promise<Division | undefined> {
    return curdUtil.commonDelete({ repository: this.divisionRepository, CLS_NAME, id });
  }
}
