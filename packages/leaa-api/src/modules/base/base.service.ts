import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

@Injectable()
export abstract class BaseService<Entity extends ObjectLiteral> {
  protected constructor(private readonly _repository: Repository<Entity>) {}

  buildQueryBuilder(queryParam: any, qb: SelectQueryBuilder<Entity>) {
    const aliasName = new SelectQueryBuilder(qb).alias;

    qb.orderBy(`${aliasName}.${queryParam.orderBy}`, queryParam.orderSort);
    qb.take(queryParam.pageSize);

    if (queryParam.page) {
      qb.skip((queryParam.page - 1) * Number(queryParam.pageSize));
    }

    // console.log('---- 🍐 QUERY-PARAM ----\n', queryParam, '\n');

    return qb;
  }
}
