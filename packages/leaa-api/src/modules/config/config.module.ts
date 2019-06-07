import { Module, Global } from '@nestjs/common';

import { ConfigService } from './config.service';

const envFieldName = process.env.NODE_ENV !== 'production' ? `.env.${process.env.NODE_ENV}` : '.env';

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
