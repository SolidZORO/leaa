import { FindManyOptions } from 'typeorm';
import { ItemsArgs } from '@leaa/common/dtos/_common';
// import { GetCommonItemsArgsDto } from '@leaa/common/dtos/_common';

type IFormatArgs = ItemsArgs & FindManyOptions;

function formatArgs(args: IFormatArgs): IFormatArgs {
  const nextArgs = args;

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

  // console.log('FORMAT-ARGS AFTER:', nextArgs);
  return nextArgs;
}

export const formatUtil = {
  formatArgs,
};
