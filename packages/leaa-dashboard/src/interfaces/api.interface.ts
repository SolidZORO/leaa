export declare interface ICurdGetDataWithPagination<T> {
  count: number;
  data: T[];
  page: number;
  pageCount: number;
  total: number;
}

export declare type ICurdDeleteData<T> = T;

export declare interface ICurdError {
  error: string;
  message: string;
  statusCode: number;
}
