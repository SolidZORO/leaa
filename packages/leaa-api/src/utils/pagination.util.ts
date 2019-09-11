export interface IPageInfo {
  items: any[];
  total: number;
  pageSize?: number;
  page?: number;
}

export interface IPageInfoResult {
  items: any[];
  itemsCount: number;
  total: number;
  pageSize: number;
  page: number;
  nextPage: number | null;
}

function calcPageInfo({ items, total, pageSize, page }: IPageInfo): IPageInfoResult {
  const calcPage = page || 0;
  const calcPageSize = pageSize || 0;

  let calcNextPage: number | null = calcPage + 1;

  if (page && pageSize && items.length < pageSize) {
    calcNextPage = null;
  }

  // console.log(items.length, total, pageSize, page, 'N>>>>', calcNextPage);

  return {
    items,
    itemsCount: items.length || 0,
    total,
    pageSize: calcPageSize,
    page: calcPage,
    nextPage: calcNextPage,
  };
}

export const paginationUtil = {
  calcPageInfo,
};
