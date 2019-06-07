import path from 'path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { cliUtil } from '@leaa/common/utils';
import { LoggerService } from '@leaa/api/modules/logger/logger.service';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { AppModule } from './modules/app/app.module';

(async function bootstrap() {
  const logger = new Logger('Log');
  logger.log('App Launcher...', ' 🚀 ');

  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  const publicPath = path.resolve('public');
  logger.log(publicPath, 'StaticAssets');
  app.useStaticAssets(publicPath);

  const configService = await app.get(ConfigService);
  await app.listen(configService.get('PORT'));

  cliUtil.emoji({
    PROTOCOL: configService.get('PROTOCOL'),
    PORT: configService.get('PORT'),
    BASE_HOST: configService.get('BASE_HOST'),
    NODE_ENV: configService.get('NODE_ENV'),
    showGraphql: true,
  });
})();
