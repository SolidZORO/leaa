import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Action } from '@leaa/common/src/entrys';
import { Repository } from 'typeorm';

@Injectable()
export class ActionService extends TypeOrmCrudService<Action> {
  constructor(@InjectRepository(Action) private readonly actionRepo: Repository<Action>) {
    super(actionRepo);
  }
}
