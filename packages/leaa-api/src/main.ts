import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from './configs/config.service';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = await app.get(ConfigService);

  await app.listen(configService.get('PORT'));

  // emoji for CLI
  const serverBaseByText = `${configService.get('PROTOCOL')}://${configService.get('BASE_HOST')}:${configService.get(
    'PORT',
  )}`;
  const serverBaseByEmoji = `✨✨ \x1b[00;44;9m${serverBaseByText}\x1b[0m ✨✨`;
  const serverGraphqlByEmoji = `✨✨ \x1b[00;41;9m${serverBaseByText}/graphql\x1b[0m ✨✨`;

  console.log(`\n\n> ${configService.get('NODE_ENV')} URL ${serverBaseByEmoji}\n`);
  console.log(`> ${configService.get('NODE_ENV')} GQL ${serverGraphqlByEmoji}\n\n`);
}());
