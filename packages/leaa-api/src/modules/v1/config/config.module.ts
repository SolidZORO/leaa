import path from 'path';
import { Module, Global } from '@nestjs/common';

import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';

const __DEV__ = process.env.NODE_ENV !== 'production';

const envFilePath = __DEV__
  ? path.resolve(__dirname, '../../../../.env')
  : path.resolve(__dirname, '../../../../../../.env.production');

console.log('envFilePath:', envFilePath);

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
