import path from 'path';
import { Module, Global } from '@nestjs/common';

import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';

// Keep docker .env compatible, and follow dotenv recommended
// @link https://github.com/motdotla/dotenv#should-i-have-multiple-env-files
let envFileName = `.env.${process.env.NODE_ENV}`;

if (process.env.NODE_ENV === 'production') {
  envFileName = '.env';
}
if (process.env.NODE_ENV === 'test') {
  envFileName = '.env';
}

const envFilePath = path.resolve(envFileName);
export const envConfig = new ConfigService(envFilePath);

console.log('\n\n\n\n\n\n\n\n🟨️ .env File Path:', envFilePath, '\n');

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
