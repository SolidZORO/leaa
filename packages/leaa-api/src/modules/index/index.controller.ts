import fs from 'fs';
import path from 'path';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { IBuild } from '@leaa/api/src/interfaces';

@Controller('')
export class IndexController {
  constructor(readonly configService: ConfigService) {}

  @Get('')
  async test() {
    const BUILDINFO_PATH = path.resolve(__dirname, `../../../${this.configService.PUBLIC_DIR}/buildinfo.json`);

    const defaultBuildInfo: IBuild = {
      BUILDTIME: 'DEV',
      VERSION: 'DEV',
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

        <h1>hello, leaa-api.</h1>

        <div class="build-list">
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
