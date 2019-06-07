import { Module } from '@nestjs/common';

// import { ConfigModule } from './configs/config.module';
import { ConfigModule } from '@leaa/api/modules/config/config.module';
import { AppController } from '@leaa/api/modules/app/app.controller';
import { AppService } from '@leaa/api/modules/app/app.service';

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
