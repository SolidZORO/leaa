import { Repository } from 'typeorm';
import { loggerUtil } from '@leaa/api/src/utils';

const commonUpdate = async (
  repository: Repository<any>,
  id: any,
  args: any,
  CONSTRUCTOR_NAME: string,
): Promise<any | undefined> => {
  if (!args) {
    const message = `update item ${id} args does not exist`;

    loggerUtil.warn(message, CONSTRUCTOR_NAME);

    return undefined;
  }

  const prevItem = await repository.findOne(id);

  if (!prevItem) {
    const message = `update item ${id} does not exist`;

    loggerUtil.warn(message, CONSTRUCTOR_NAME);

    return undefined;
  }

  const nextItem = await repository.save({
    ...prevItem,
    ...args,
  });

  await loggerUtil.updateLog({ id, prevItem, nextItem, constructorName: CONSTRUCTOR_NAME });

  return nextItem;
};

const commonDelete = async (
  repository: Repository<any>,
  id: number,
  CONSTRUCTOR_NAME: string,
): Promise<any | undefined> => {
  const prevId = id;
  const prevItem = await repository.findOne(id);

  if (!prevItem) {
    const message = `delete item ${id} does not exist`;

    loggerUtil.warn(message, CONSTRUCTOR_NAME);

    return undefined;
  }

  const nextItem = await repository.remove(prevItem);

  if (!nextItem) {
    const message = `delete item ${id} faild`;

    loggerUtil.warn(message, CONSTRUCTOR_NAME);

    return undefined;
  }

  loggerUtil.warn(`delete item ${id} successful: ${JSON.stringify(nextItem)}\n\n`, CONSTRUCTOR_NAME);

  return {
    ...nextItem,
    id: prevId,
  };
};

export const curdUtil = {
  commonUpdate,
  commonDelete,
};
