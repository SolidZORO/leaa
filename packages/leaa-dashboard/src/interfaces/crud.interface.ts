import { CreateQueryParams } from '@nestjsx/crud-request';

export interface ICrudListQueryParams extends CreateQueryParams {
  q?: string;
  s?: string;
  categoryId?: string;
  banderId?: string;
  tagId?: string;
  userId?: string;
  filterbar?: string;
}

export interface ICrudListRes<T> {
  count: number;
  data?: T[];
  page: number;
  pageCount: number;
  total: number;
}
