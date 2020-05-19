import { Module, Global } from '@nestjs/common';

import { ConfigService } from '@leaa/api/src/modules/config/config.service';

const __DEV__ = process.env.NODE_ENV !== 'production';
const envFieldName = __DEV__ ? '.env' : '.env.production';

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
