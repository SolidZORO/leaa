import _ from 'lodash';
import { Repository } from 'typeorm';
import { loggerUtil, stringUtil } from '@leaa/api/src/utils';
import { IGqlCtx } from '@leaa/api/src/interfaces';

const isOneField = (args: {}, fieldName: string) => _.keys(args).length === 1 && _.has(args, fieldName);

interface ICommonCreate<Entity, CreateInput> {
  CLS_NAME?: string;
  repository: Repository<Entity>;
  args: CreateInput;
  extArgs?: Partial<CreateInput>;
  relationArgs?: any;
  gqlCtx?: IGqlCtx;
}

const commonCreate = async <Entity, CreateInput>({
  repository,
  CLS_NAME,
  args,
  extArgs,
  gqlCtx,
}: ICommonCreate<Entity, CreateInput>): Promise<any | undefined> => {
  if (!args) {
    const message = 'Not Found Args';

    loggerUtil.warn(message, CLS_NAME);

    return undefined;
  }

  let nextArgs = args;

  if (extArgs) {
    nextArgs = { ...args, ...nextArgs };
  }

  const item: Entity = await repository.save(nextArgs);

  // @ts-ignore
  const hashId = stringUtil.encodeId(item.id, gqlCtx);

  // @ts-ignore
  await rp.update(item.id, { hashId });

  return { ...item, hashId };
};

const commonUpdate = async (
  repository: Repository<any>,
  CLS_NAME: string,
  id: any,
  args: any,
  relationArgs: any = {},
): Promise<any | undefined> => {
  if (!args) {
    const message = `Not Found Args by ${id}`;

    loggerUtil.warn(message, CLS_NAME);

    return undefined;
  }

  const prevItem = await repository.findOne(id);

  if (!prevItem) {
    const message = `Not Found Item ${id}`;

    loggerUtil.warn(message, CLS_NAME);

    return undefined;
  }

  const nextItem = await repository.save({
    ...prevItem,
    ...args,
    ...relationArgs,
  });

  await loggerUtil.updateLog({ id, prevItem, nextItem, constructorName: CLS_NAME });

  return nextItem;
};

const commonDelete = async (repository: Repository<any>, CLS_NAME: string, id: number): Promise<any | undefined> => {
  const prevId = id;
  const prevItem = await repository.findOne(id);

  if (!prevItem) {
    const message = `Not Found Item ${id}`;

    loggerUtil.warn(message, CLS_NAME);

    return undefined;
  }

  const nextItem = await repository.remove(prevItem);

  if (!nextItem) {
    const message = `Delete Item ${id} Faild`;

    loggerUtil.warn(message, CLS_NAME);

    return undefined;
  }

  loggerUtil.warn(`delete item ${id} successful: ${JSON.stringify(nextItem)}\n\n`, CLS_NAME);

  return {
    ...nextItem,
    id: prevId,
  };
};

export const curdUtil = {
  isOneField,
  commonCreate,
  commonUpdate,
  commonDelete,
};
