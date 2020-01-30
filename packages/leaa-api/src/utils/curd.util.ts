import _ from 'lodash';
import { v4 } from 'uuid';
import { Repository } from 'typeorm';
import { loggerUtil, stringUtil, msgUtil } from '@leaa/api/src/utils';
import { IGqlCtx } from '@leaa/api/src/interfaces';
import { IPageInfoFromQueryBuilder, IPageInfoResult } from '@leaa/api/src/utils/pagination.util';

const isOneField = (args: {}, fieldName: string) => _.keys(args).length === 1 && _.has(args, fieldName);

interface ICommonCreate<Entity, CreateInput> {
  CLS_NAME?: string;
  repository: Repository<Entity>;
  args: CreateInput;
  extArgs?: Partial<CreateInput>;
  gqlCtx?: IGqlCtx;
}

const commonCreate = async <Entity, CreateInput>({
  CLS_NAME,
  repository,
  args,
  extArgs,
  gqlCtx,
}: ICommonCreate<Entity, CreateInput>): Promise<any | undefined> => {
  if (!args) {
    loggerUtil.warn('Not Found Args (Create)', CLS_NAME);
    throw msgUtil.error({ t: ['_error:notFoundArgs'], gqlCtx });
  }

  let nextArgs = args;

  if (extArgs) {
    nextArgs = { ...args, ...nextArgs };
  }

  const item: Entity = await repository.save(nextArgs);

  // @ts-ignore
  if (!item.id) {
    loggerUtil.warn('Not Found Item ID (Create)', CLS_NAME);
    throw msgUtil.error({ t: ['_error:notFoundItem'], gqlCtx });
  }

  // @ts-ignore
  const hashId = stringUtil.encodeId(item.id, gqlCtx);

  // @ts-ignore
  await repository.update(item.id, { hashId });

  return { ...item, hashId };
};

//
//
//
//

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

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

interface IDeleteFields<T> {
  data: Array<T>;
  fields: string[];
}

const deleteFields = <T>({ data, fields }: IDeleteFields<T>): T[] => {
  // TODO / TIPS
  // there is a BUG here. you cannot delete the `id`.
  // if the `id` is `null`, the frontend query using graphql-tag will cause all entries to be the same.
  // so, here gen a random int.
  const random = new Date().getMilliseconds() * getRandomInt(2, 9);

  if (fields && Array.isArray(fields)) {
    data.forEach(item => {
      fields.forEach(field => {
        const fieldSplit: string[] = field.split('.');

        if (fieldSplit.length === 2) {
          // prettier-ignore
          // @ts-ignore
          item[fieldSplit[0]] && item[fieldSplit[0]].forEach((subField: any) => {
              subField[fieldSplit[1]] = subField[fieldSplit[1]] -random;
            });
        } else if (fieldSplit.length === 1) {
          // @ts-ignore
          item[field] = item[field] - random;
        }
      });
    });
  }

  return data;
};

export const curdUtil = {
  isOneField,
  deleteFields,
  commonCreate,
  commonUpdate,
  commonDelete,
};
