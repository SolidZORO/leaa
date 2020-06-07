import path from 'path';
import { Module, Global } from '@nestjs/common';

import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';

const __PROD__ = process.env.NODE_ENV === 'production';
const envFilePath = path.resolve(__PROD__ ? '.env.production' : '.env');

console.log('\n\n🌈  .env File Path:', envFilePath, '\n\n');

export const envConfig = new ConfigService(envFilePath);

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(envFilePath),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
