import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Setting } from '@leaa/common/src/entrys';

import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  providers: [SettingService],
  exports: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
