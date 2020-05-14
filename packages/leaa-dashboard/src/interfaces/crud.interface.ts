import { CreateQueryParams } from '@nestjsx/crud-request';

export interface ICrudQueryParams extends CreateQueryParams {
  q?: string;
  s?: string;
}
