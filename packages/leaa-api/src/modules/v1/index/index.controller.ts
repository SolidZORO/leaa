import fs from 'fs';
import path from 'path';
import { Repository } from 'typeorm';
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';

import { IBuild } from '@leaa/api/src/interfaces';
import { Setting } from '@leaa/api/src/entrys';
import { genSlug } from '@leaa/api/src/utils';

@Controller('')
export class IndexController {
  constructor(
    @InjectRepository(Setting) private readonly settingRepo: Repository<Setting>,
    readonly configService: ConfigService,
  ) {}

  @Get('')
  async test() {
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

    const styleFontFamily =
      // eslint-disable-next-line max-len
      "'Avenir Next', 'Avenir', 'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;";

    return `
      <div>
        <style>
          body  {
            font-family: ${styleFontFamily};
            font-size: 100%;
            user-select: revert;
          }
          
          h1 {
            font-size: 120%;
            font-weight: 600;
          }
          
          .build-list {
            position: fixed;
            left: 16px;
            bottom: 16px;
            font-size: 50%;
            color: #e2e2e2;
            transition: all 0.3s;
          }
          
          .build-list:hover {
            color: #000;
            transition: all 0.3s;
          }
          
          .build-item {
            font-size: 80%;
          }    
          
          .build-item span {
            display: inline-block;
          }
          
          .build-item strong {
            font-weight: 400;
            margin-left: 5px;
            font-family: monospace;
          }    
        </style>

        <h1>hello, ${this.configService.SERVER_NAME}.</h1>

        <div class="build-list">
          <div class="build-item">
            <span>NAME:</span>
            <strong>${buildInfo.NAME}</strong>
          </div>
          
          <div class="build-item">
            <span>MODE:</span>
            <strong>${buildInfo.MODE}</strong>
          </div>
          
          <br />
          
          <div class="build-item">
            <span>VERSION:</span>
            <strong>${buildInfo.VERSION}</strong>
          </div>
          
          <div class="build-item">
            <span>BUILDTIME:</span>
            <strong>${buildInfo.BUILDTIME}</strong>
          </div>
        </div>
      </div>
    `;
  }
}
