import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Action } from '@leaa/common/src/entrys';
import { ICrudRequest } from '@leaa/api/src/interfaces';
import { CreateActionInput } from '@leaa/common/src/dtos/action';
import { Repository } from 'typeorm';

@Injectable()
export class ActionService extends TypeOrmCrudService<Action> {
  constructor(@InjectRepository(Action) private readonly actionRepo: Repository<Action>) {
    super(actionRepo);
  }

  async logAction(req: ICrudRequest, body: CreateActionInput): Promise<Action | undefined> {
    return this.actionRepo.save(body);
  }
}
