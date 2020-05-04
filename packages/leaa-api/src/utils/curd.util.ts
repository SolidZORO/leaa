import _ from 'lodash-es';
import { Repository } from 'typeorm';

import { loggerUtil, msgUtil } from '@leaa/api/src/utils';
import { IGqlCtx } from '@leaa/api/src/interfaces';

const isOneField = (args: {}, fieldName: string) => _.keys(args).length === 1 && _.has(args, fieldName);

interface ICommonUpdate<Entity, UpdateInput> {
  CLS_NAME: string;
  repository: Repository<Entity>;
  args: UpdateInput;
  id: any;
  relation?: any;
  gqlCtx?: IGqlCtx;
}

const commonUpdate = async <Entity, UpdateInput>({
  CLS_NAME,
  repository,
  args,
  id,
  relation = {},
  gqlCtx,
}: ICommonUpdate<Entity, UpdateInput>): Promise<any | undefined> => {
  if (!args) {
    loggerUtil.warn(`Not Found Args by #${id} (Update)`, CLS_NAME);
    throw msgUtil.error({ t: ['_error:notFoundArgs'], gqlCtx });
  }

  const prevItem = await repository.findOne(id);

  if (!prevItem) {
    loggerUtil.warn(`Not Found Item #${id} (Update)`, CLS_NAME);
    throw msgUtil.error({ t: ['_error:notFoundItem'], gqlCtx });
  }

  const nextItem = await repository.save({
    ...prevItem,
    ...args,
    ...relation,
  });

  await loggerUtil.updateLog({ id, prevItem, nextItem, constructorName: CLS_NAME });

  return nextItem;
};

//
//
//
//

interface ICommonDelete<Entity> {
  CLS_NAME: string;
  repository: Repository<Entity>;
  id: any;
  gqlCtx?: IGqlCtx;
}

const commonDelete = async <Entity, UpdateInput>({
  CLS_NAME,
  repository,
  id,
  gqlCtx,
}: ICommonDelete<Entity>): Promise<any | undefined> => {
  const prevId = id;
  const prevItem = await repository.findOne(id);

  if (!prevItem) {
    loggerUtil.warn(`Not Found Item #${id} (Delete)`, CLS_NAME);
    throw msgUtil.error({ t: ['_error:notFoundItem'], gqlCtx });
  }

  const nextItem = await repository.remove(prevItem);

  if (!nextItem) {
    loggerUtil.warn(`Delete Item #${id} Failed`, CLS_NAME);
    throw msgUtil.error({ t: ['_error:deleteItemFailed'], gqlCtx });
  }

  loggerUtil.warn(`Delete Item #${id} Successful: ${JSON.stringify(nextItem)}\n\n`, CLS_NAME);

  return {
    ...nextItem,
    id: prevId,
  };
};

//
//
//
//

export const curdUtil = {
  isOneField,
  commonUpdate,
  commonDelete,
};
