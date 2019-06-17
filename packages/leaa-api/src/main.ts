import path from 'path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { cliUtil } from '@leaa/common/utils';
import { LoggerService } from '@leaa/api/modules/logger/logger.service';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { AppModule } from './app.module';

(async function bootstrap() {
  const logger = new Logger('App-Log');
  logger.log('App Launcher...', ' 🚀 ');

  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  const publicPath = path.resolve('public');
  app.useStaticAssets(publicPath);

  app.disable('x-powered-by');
  app.enableCors({
    origin: true,
    credentials: true,
    maxAge: 0,
    optionsSuccessStatus: 200,
    exposedHeaders: ['Authorization'],
    // methods: '';
    // allowedHeaders: '';
    // preflightContinue: false;
  });

  const configService = await app.get(ConfigService);
  await app.listen(configService.PORT);

  cliUtil.emoji({
    PROTOCOL: configService.PROTOCOL,
    PORT: configService.PORT,
    BASE_HOST: configService.BASE_HOST,
    NODE_ENV: configService.NODE_ENV,
    showGraphql: true,
  });
})();
