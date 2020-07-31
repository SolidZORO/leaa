import fs from 'fs';
import path from 'path';
import { Repository } from 'typeorm';
import { Controller, Get, Render } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';

import { IBuild } from '@leaa/api/src/interfaces';
import { Setting } from '@leaa/api/src/entrys';
import { genSlug } from '@leaa/api/src/utils';

@Controller('')
export class IndexController {
  constructor(
    @InjectRepository(Setting) private readonly settingRepo: Repository<Setting>,
    private readonly configService: ConfigService,
  ) {}

  @Get('')
  @Render('index')
  async index() {
    const BUILDINFO_PATH = path.resolve('public/version.txt');
    const dbSiteName = await this.settingRepo.findOne({ slug: 'site_name' });
    const siteName = dbSiteName?.value ? genSlug(dbSiteName.value) : 'UNKNOW';
    const defaultBuildInfo: IBuild = {
      NAME: siteName,
      BUILDTIME: 'DEV',
      VERSION: 'DEV',
      MODE: process.env.NODE_ENV || 'UNKNOW',
    };

    let buildInfo: IBuild = defaultBuildInfo;

    if (fs.existsSync(BUILDINFO_PATH)) {
      try {
        const buildInfoString = fs.readFileSync(BUILDINFO_PATH).toString();
        buildInfo = {
          ...defaultBuildInfo,
          ...JSON.parse(buildInfoString),
        };
      } catch (err) {
        console.log('buildInfoString loading error:', err);
      }
    }

    return {
      welcomeText: `hello, ${this.configService.SERVER_NAME}.`,
      buildInfo,
    };
  }
}
