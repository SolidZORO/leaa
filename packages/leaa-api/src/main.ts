import path from 'path';
import helmet from 'helmet';
import nunjucks from 'nunjucks';
import rateLimit from 'express-rate-limit';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '@leaa/api/src/app.module';
import { HttpExceptionFilter } from '@leaa/api/src/filters';
import { I18nextMiddleware } from '@leaa/api/src/middlewares';
import { TransformInterceptor } from '@leaa/api/src/interceptors';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';
import { LoggerService } from '@leaa/api/src/modules/v1/logger/logger.service';

import { TagService } from '@leaa/api/src/modules/v1/tag/tag.service';

import { envInfoForCli } from '@leaa/api/src/utils';

(async function bootstrap() {
  const logger = new Logger('App-Log');
  logger.log('App Launcher...', ' 🚀 ');

  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  const configService = await app.get(ConfigService);

  const rootPath = path.resolve(__dirname, '..');
  const publicPath = `${rootPath}/${configService.PUBLIC_DIR}`;
  const viewsPath = `${rootPath}/resources/views`;

  app.useStaticAssets(publicPath);

  const njkEnv = nunjucks.configure([viewsPath], {
    // autoescape: true,
    // throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: false,
    watch: true,
    noCache: process.env.NODE_ENV !== 'production',
    express: app,
  });

  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('njk');
  app.engine('njk', njkEnv.render);
  app.set('view cache', true);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.disable('x-powered-by');
  app.enableCors({
    origin: '*',
    // origin: true,
    // credentials: true,
    maxAge: 0,
    optionsSuccessStatus: 200,
    // methods: '',
    allowedHeaders: ['Content-Type', 'Authorization', 'Guthorization', 'Duthorization'],
    exposedHeaders: ['Authorization'],
    // preflightContinue: false,
  });

  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: configService.RATELIMIT_WINDOWMS, // * minutes
      max: configService.RATELIMIT_MAX, // limit each IP to * requests per windowMs
    }),
  );
  app.use(I18nextMiddleware);

  await app.listen(configService.SERVER_PORT);

  // ⚠️ sync all tags to file @ initApp
  if (configService.AUTO_CUT_TAGS) {
    const tagService = await app.get(TagService);
    await tagService.syncTagsToDictFile();
  }

  envInfoForCli({
    config: configService,
    NODE_ENV: process.env.NODE_ENV,
    PUBLIC_PATH: publicPath,
    VIEWS_PATH: viewsPath,
    DIRNAME: __dirname,
  });
})();
