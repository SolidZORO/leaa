import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Promo } from '@leaa/common/src/entrys';
import { PromoResolver } from '@leaa/api/src/modules/promo/promo.resolver';
import { PromoService } from '@leaa/api/src/modules/promo/promo.service';
import { PromoProperty } from '@leaa/api/src/modules/promo/promo.property';

@Module({
  imports: [TypeOrmModule.forFeature([Promo])],
  providers: [PromoProperty, PromoResolver, PromoService],
  exports: [PromoProperty, PromoResolver, PromoService],
})
export class PromoModule {}
