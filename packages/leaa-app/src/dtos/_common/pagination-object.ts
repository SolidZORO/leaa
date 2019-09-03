export interface PaginationObject {
  page: number;
  pageSize: number;
  total: number;
  nextPage?: number | null;
  itemsCount?: number;
}
