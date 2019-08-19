import { FindManyOptions } from 'typeorm';
import { ItemsArgs } from '@leaa/common/src/dtos/_common';

type IFormatArgs = FindManyOptions & ItemsArgs;

function formatArgs<T>(args: T & IFormatArgs): T & IFormatArgs {
  if (!args) {
    throw Error('missing format args');
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
}

export const formatUtil = {
  formatArgs,
};
