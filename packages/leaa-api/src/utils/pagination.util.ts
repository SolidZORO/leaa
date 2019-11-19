import { SelectQueryBuilder } from 'typeorm';

export interface IPageInfoFromQueryBuilder {
  qb: SelectQueryBuilder<any>;
  pageSize?: number;
  page?: number;
}

export interface IPageInfoResult {
  items: any[];
  total: number;
  pageSize: number;
  page: number;
  nextPage: number | null;
}

async function calcPageInfoFromQueryBuilder({
  qb,
  pageSize,
  page,
}: IPageInfoFromQueryBuilder): Promise<IPageInfoResult> {
  const calcPage = page || 0;
  const calcPageSize = pageSize || 30;

  const [items, total] = await qb
    .skip((calcPage - 1) * calcPageSize)
    .take(calcPageSize)
    .getManyAndCount();

  let calcNextPage: number | null = calcPage + 1;

  if (page && pageSize && items.length < pageSize) {
    calcNextPage = null;
  }

  return {
    items,
    total,
    pageSize: calcPageSize,
    page: calcPage,
    nextPage: calcNextPage,
  };
}

export const paginationUtil = {
  calcQueryBuilderPageInfo: calcPageInfoFromQueryBuilder,
};
