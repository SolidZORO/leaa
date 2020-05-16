import { CrudGlobalConfig } from '@nestjsx/crud';

// Global Options Not Working https://github.com/nestjsx/crud/issues/273
// if bug fixed, i will move to CrudConfigService.load global setting.
export const crudConfig: CrudGlobalConfig = {
  // queryParser: {
  //   paramNamesMap: {
  //     search: 'q',
  //   },
  // },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    maxLimit: 10000,
    alwaysPaginate: true,
  },
};
