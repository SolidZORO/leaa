import { QuerySort, QuerySortArr } from '@nestjsx/crud-request';

export const calcTableDefaultSortOrder = (
  sort?: string,
  by?: string,
  field?: string,
): 'descend' | 'ascend' | boolean => {
  if (!by || !sort || !field) {
    return false;
  }

  if (by === field) {
    if (sort === 'DESC') {
      return 'descend';
    }
    if (sort === 'ASC') {
      return 'ascend';
    }
  }

  return false;
};

export const calcTableSortOrder = (
  currentField: string,
  sort?: QuerySort | QuerySortArr | Array<QuerySort | QuerySortArr> | undefined,
): 'descend' | 'ascend' | boolean => {
  if (!currentField || !sort) {
    return false;
  }

  const sortFidle = sort && Array.isArray(sort) && sort[0];
  const sortSort = sort && Array.isArray(sort) && sort[1];

  if (sortFidle === currentField) {
    if (sortSort === 'DESC') return 'descend';

    if (sortSort === 'ASC') return 'ascend';
  }

  return false;
};
