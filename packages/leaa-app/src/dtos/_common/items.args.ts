export type IOrderSort = 'ASC' | 'DESC' | undefined;

export interface ItemsArgs {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderSort?: IOrderSort;
  q?: string;
}
