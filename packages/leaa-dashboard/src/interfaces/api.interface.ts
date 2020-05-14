export declare interface IApiCurdGetDataWithPagination<T> {
  count: number;
  data: T[];
  page: number;
  pageCount: number;
  total: number;
}

export declare type IApiCurdDeleteData<T> = T;

export declare interface IApiCurdError {
  error: string;
  message: string;
  statusCode: number;
}
