import { CommonGetItemsArgsDto } from '@leaa/common/dtos/_common';

// const argsSample = {
//   page: 1,      -> skip -> page * take
//   pageSize: 30, -> take
//   orderBy: 'id',
//   orderSort: 'ASC',
//   skip: 0,
//   take: 1,
// };

interface IFormatArgs extends CommonGetItemsArgsDto {
  take?: number;
  skip?: number;
  current?: number;
}

function formatArgs<T>(args: IFormatArgs & T): IFormatArgs & T {
  // console.log('FORMAT-ARGS BEFORE:', args);
  const nextArgs = args;

  if (args.page) {
    nextArgs.current = args.page;
  }

  if (args.pageSize) {
    nextArgs.take = args.pageSize;
  }

  if (args.pageSize && args.page && args.page > 0) {
    const queryPage = args.page - 1 > 0 ? args.page - 1 : 0;

    nextArgs.skip = queryPage * args.pageSize;
  }

  // console.log('FORMAT-ARGS AFTER:', nextArgs);
  return nextArgs;
}

export const formatUtil = {
  formatArgs,
};
