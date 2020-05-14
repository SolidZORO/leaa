import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Company } from '@leaa/common/src/entrys';
import { Repository } from 'typeorm';
import { ActionService } from '@leaa/api/src/modules/action/action.service';

@Injectable()
export class CompanyService extends TypeOrmCrudService<Company> {
  constructor(@InjectRepository(Company) repo: Repository<Company>, private readonly actionService: ActionService) {
    super(repo);
  }

  async createOne(req: any, dto: any): Promise<any> {
    // log
    const loginAction = await this.actionService.createOne(req, {
      // ip: req?.ip,
      module: 'auth',
      action: 'login',
      // token: body.guestToken || 'NO-TOKEN',
      // account,
    });

    console.log(req, '>>>>>>>>>>>>>>>>>>>', loginAction);

    return super.createOne(req, {
      name: `${new Date().valueOf()}`,
      age: 11,
      // ip: req?.ip,
      // module: 'auth',
      // action: 'login',
      // token: body.guestToken || 'NO-TOKEN',
      // account,
    });
  }
}
