import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Setting } from '@leaa/common/src/entrys';
import { SettingResolver } from '@leaa/api/src/modules/setting/setting.resolver';
import { SettingService } from '@leaa/api/src/modules/setting/setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting]), CacheModule.register()],
  providers: [SettingResolver, SettingService],
  exports: [SettingService],
})
export class SettingModule {}
