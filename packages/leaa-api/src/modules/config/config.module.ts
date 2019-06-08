import { Module, Global } from '@nestjs/common';

import { ConfigService } from './config.service';

const envFieldName = '.env';
export const envConfig = new ConfigService(envFieldName);

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(envFieldName),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
