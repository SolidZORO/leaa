import { CrudRequest } from '@nestjsx/crud';

export const req: CrudRequest | any = {
  parsed: {
    fields: [],
    paramsFilter: [],
    authPersist: undefined as any,
    search: {},
    filter: [],
    or: [],
    join: [],
    sort: [],
    limit: 9999,
    offset: 0,
    page: 1,
    cache: 0,
  },
  options: {
    query: {},
    routes: {
      getManyBase: { interceptors: [], decorators: [] },
      getOneBase: { interceptors: [], decorators: [] },
      createOneBase: {
        interceptors: [],
        decorators: [],
        returnShallow: false,
      },
      createManyBase: { interceptors: [], decorators: [] },
      updateOneBase: {
        interceptors: [],
        decorators: [],
        allowParamsOverride: false,
        returnShallow: false,
      },
      replaceOneBase: {
        interceptors: [],
        decorators: [],
        allowParamsOverride: false,
        returnShallow: false,
      },
      deleteOneBase: {
        interceptors: [],
        decorators: [],
        returnDeleted: true,
      },
    },
    // params: {},
    params: { id: { field: 'id', type: 'uuid', primary: true } },
  },
};
