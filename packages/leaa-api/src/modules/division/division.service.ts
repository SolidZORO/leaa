import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Division, User } from '@leaa/common/src/entrys';
import {
  DivisionsArgs,
  DivisionsWithPaginationObject,
  DivisionArgs,
  UpdateDivisionInput,
  CreateDivisionInput,
} from '@leaa/common/src/dtos/division';
import { argsUtil, paginationUtil, curdUtil, loggerUtil } from '@leaa/api/src/utils';
import { IDivisionSource } from '@leaa/common/src/interfaces';
import { SyncTagsToFileObject } from '@leaa/common/src/dtos/tag';
import { divisionConfig } from '@leaa/api/src/configs';

const CLS_NAME = 'DivisionService';

type IDivisionsArgs = DivisionsArgs & FindOneOptions<Division>;
type IDivisionArgs = DivisionArgs & FindOneOptions<Division>;

@Injectable()
export class DivisionService {
  constructor(@InjectRepository(Division) private readonly divisionRepository: Repository<Division>) {}

  async divisions(args: IDivisionsArgs, user?: User): Promise<DivisionsWithPaginationObject> {
    const nextArgs: IDivisionsArgs = argsUtil.format(args);

    const PRIMARY_TABLE = 'divisions';
    const qb = await this.divisionRepository.createQueryBuilder(PRIMARY_TABLE);

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async divisionsMapping(): Promise<string | undefined> {
    if (!fs.existsSync(divisionConfig.DIVISION_OF_CHINA_FILE_PATH)) {
      await this.syncDivisionToFile();
    }

    return fs.readFileSync(divisionConfig.DIVISION_OF_CHINA_FILE_PATH, 'utf8');
  }

  async division(id: number, args?: IDivisionArgs, user?: User): Promise<Division | undefined> {
    let nextArgs: IDivisionArgs = {};

    if (args) {
      nextArgs = args;
    }

    return this.divisionRepository.findOne(id, nextArgs);
  }

  async formatDivision(items: any[]) {
    const provinces = items.filter(v => v.code && !v.province_code && !v.city_code);
    const cities = items.filter(v => v.code && v.province_code && !v.city_code);
    const areas = items.filter(v => v.code && v.province_code && v.city_code);

    /* eslint-disable no-return-assign */
    /* eslint-disable no-param-reassign */
    provinces.forEach(pv => {
      pv.value = pv.name;
      pv.children = [];
    });

    cities.forEach(cv => {
      cv.children = [];
      cv.value = cv.name;
    });

    areas.forEach(av => cities.find(c => c.code === av.city_code).children.push({ value: av.name }));
    cities.forEach(cv =>
      provinces.find(p => p.code === cv.province_code).children.push({ value: cv.name, children: cv.children }),
    );

    provinces.forEach(pv => {
      delete pv.code;
      delete pv.city_code;
      delete pv.province_code;
    });

    return fs.writeFileSync(divisionConfig.DIVISION_OF_CHINA_FILE_PATH, JSON.stringify(provinces));
  }

  async syncDivisionToFile(): Promise<SyncTagsToFileObject> {
    if (!fs.existsSync(divisionConfig.DIVISION_OF_CHINA_FILE_PATH)) {
      loggerUtil.log(`syncDivisionToFile, not exists ${divisionConfig.DIVISION_OF_CHINA_FILE_PATH}`, CLS_NAME);

      mkdirp(divisionConfig.DIVISION_DIR, err =>
        loggerUtil.log(`syncTagsToDictFile, mkdirp ${divisionConfig.DIVISION_DIR} ${JSON.stringify(err)}`, CLS_NAME),
      );
    }

    let sqlRunResultMessage = 'Skip insert database';

    const divisionCount = await this.divisionRepository.count({ select: ['code'] });

    if (!divisionCount) {
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */

      const DIVISION_SOURCE_DIR = path.resolve(__dirname, './source/china');

      // prettier-ignore
      // eslint-disable-next-line max-len
      const provinces: IDivisionSource[] = await JSON.parse(fs.readFileSync(`${DIVISION_SOURCE_DIR}/provinces.json`, 'utf8'));
      const cities: IDivisionSource[] = await JSON.parse(fs.readFileSync(`${DIVISION_SOURCE_DIR}/cities.json`, 'utf8'));
      const areas: IDivisionSource[] = await JSON.parse(fs.readFileSync(`${DIVISION_SOURCE_DIR}/areas.json`, 'utf8'));

      let sqlBody = '';

      provinces.forEach(v => {
        sqlBody += `(${Number(v.code)}, '${v.name}', NULL, NULL), `;
      });

      cities.forEach(v => {
        sqlBody += `(${Number(v.code)}, '${v.name}', ${Number(v.provinceCode)}, NULL), `;
      });

      areas.forEach((v, i) => {
        sqlBody += `(${Number(v.code)}, '${v.name}', ${Number(v.provinceCode)}, ${Number(v.cityCode)})${
          i === areas.length - 1 ? ';' : ','
        } `;
      });

      const insertSql = `
      INSERT INTO \`divisions\` (\`code\`, \`name\`, \`province_code\`, \`city_code\`) VALUES ${sqlBody}
    `;

      const sqlRunResult = await getConnection().query(insertSql);

      sqlRunResultMessage = sqlRunResult.message;

      loggerUtil.log(`building division of china... ${sqlRunResultMessage}`, CLS_NAME);
    }

    const [items] = await this.divisionRepository.findAndCount({
      select: ['code', 'name', 'province_code', 'city_code'],
    });

    await this.formatDivision(items);

    return {
      status: `Synced. ${sqlRunResultMessage}.`,
    };
  }

  async createDivision(args: CreateDivisionInput): Promise<Division | undefined> {
    const relationArgs = {};

    return this.divisionRepository.save({ ...args, ...relationArgs });
  }

  async updateDivision(id: number, args: UpdateDivisionInput): Promise<Division | undefined> {
    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.divisionRepository, CLS_NAME, id, args);

    const nextArgs = {
      ...args,
    };

    return curdUtil.commonUpdate(this.divisionRepository, CLS_NAME, id, nextArgs);
  }

  async deleteDivision(id: number): Promise<Division | undefined> {
    return curdUtil.commonDelete(this.divisionRepository, CLS_NAME, id);
  }
}
