import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Address, User } from '@leaa/common/src/entrys';
import { AddressResolver } from '@leaa/api/src/modules/address/address.resolver';
import { AddressService } from '@leaa/api/src/modules/address/address.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User])],
  providers: [AddressResolver, AddressService],
  exports: [AddressService],
})
export class AddressModule {}
