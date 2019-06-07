import { Module } from '@nestjs/common';

import { ConfigModule } from './configs/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
}
