import _ from 'lodash';
import { Repository } from 'typeorm';

import { logger, errorMsg } from '@leaa/api/src/utils';
import { IGqlCtx } from '@leaa/api/src/interfaces';

export const isOneField = (args: {}, fieldName: string) => _.keys(args).length === 1 && _.has(args, fieldName);

interface ICommonUpdate<Entity, UpdateInput> {
  CLS_NAME: string;
  repository: Repository<Entity>;
  args: UpdateInput;
  id: any;
  relation?: any;
  gqlCtx: IGqlCtx;
}

export const commonUpdate = async <Entity, UpdateInput>({
  CLS_NAME,
  repository,
  args,
  id,
  relation = {},
  gqlCtx,
}: ICommonUpdate<Entity, UpdateInput>): Promise<any | undefined> => {
  const { t } = gqlCtx;

  if (!args) {
    logger.warn(`Not Found Args by #${id} (Update)`, CLS_NAME);
    throw errorMsg(t('_error:notFoundArgs'), { gqlCtx });
  }

  const prevItem = await repository.findOne(id);

  if (!prevItem) {
    logger.warn(`Not Found Item #${id} (Update)`, CLS_NAME);
    throw errorMsg(t('_error:notFoundItem'), { gqlCtx });
  }

  const nextItem = await repository.save({
    ...prevItem,
    ...args,
    ...relation,
  });

  await logger.updateLog({ id, prevItem, nextItem, constructorName: CLS_NAME });

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
  gqlCtx: IGqlCtx;
}

export const commonDelete = async <Entity, UpdateInput>({
  CLS_NAME,
  repository,
  id,
  gqlCtx,
}: ICommonDelete<Entity>): Promise<any | undefined> => {
  const { t } = gqlCtx;

  const prevId = id;
  const prevItem = await repository.findOne(id);

  if (!prevItem) {
    logger.warn(`Not Found Item #${id} (Delete)`, CLS_NAME);
    throw errorMsg(t('_error:notFoundItem'), { gqlCtx });
  }

  const nextItem = await repository.remove(prevItem);

  if (!nextItem) {
    logger.warn(`Delete Item #${id} Failed`, CLS_NAME);
    throw errorMsg(t('_error:deleteItemFailed'), { gqlCtx });
  }

  logger.warn(`Delete Item #${id} Successful: ${JSON.stringify(nextItem)}\n\n`, CLS_NAME);

  return {
    ...nextItem,
    id: prevId,
  };
};
