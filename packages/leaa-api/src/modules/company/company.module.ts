import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Company, Action } from '@leaa/common/src/entrys';
import { ActionService } from '@leaa/api/src/modules/action/action.service';

import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Action])],
  controllers: [CompanyController],
  providers: [CompanyService, ActionService],
  exports: [CompanyService],
})
export class CompanyModule {}
