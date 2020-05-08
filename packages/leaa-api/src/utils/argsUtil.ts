import { FindManyOptions } from 'typeorm';

import { ItemsArgs } from '@leaa/common/src/dtos/_common';
import { errorMessage } from '@leaa/api/src/utils/msg.util';
import { IGqlCtx } from '@leaa/api/src/interfaces';

type IFormatArgs = FindManyOptions & ItemsArgs;

export const argsFormat = <T>(args: T & IFormatArgs, gqlCtx?: IGqlCtx): T & IFormatArgs => {
  if (!args) {
    throw errorMessage({ t: ['_error:notFoundUser'], gqlCtx });
  }

  const nextArgs = {
    ...args,
  };

  if (args.pageSize) {
    nextArgs.take = args.pageSize;
  }

  if (args.pageSize && args.page && args.page > 0) {
    const queryPage = args.page - 1 > 0 ? args.page - 1 : 0;

    nextArgs.skip = queryPage * args.pageSize;
  }

  if (args.orderBy) {
    nextArgs.order = { [args.orderBy]: 'ASC' };
  }

  if (args.orderBy && args.orderSort) {
    const isDesc = args.orderSort.toUpperCase() === 'DESC';

    nextArgs.order = { [args.orderBy]: isDesc ? 'DESC' : 'ASC' };
  }

  return nextArgs;
};
