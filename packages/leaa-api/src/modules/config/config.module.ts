import { Module, Global } from '@nestjs/common';

import { ConfigService } from '@leaa/api/modules/config/config.service';

const dev = process.env.NODE_ENV !== 'production';
const envFieldName = dev ? '.env' : '.env.production';
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
