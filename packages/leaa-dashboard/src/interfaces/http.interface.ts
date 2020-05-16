import { AxiosResponse, AxiosError } from 'axios';

export interface IHttpResponseBase {
  statusCode: number;
  message: string;
  lang: string;
}

export interface IHttpRes<T> extends AxiosResponse {
  data: IHttpResponseBase & {
    data: T;
  };
}

export interface IHttpError extends AxiosError {}

export interface ICrudRes<T> {
  count: number;
  data: T[];
  page: number;
  pageCount: number;
  total: number;
}
