import { RouteComponentProps } from 'react-router-dom';
import { IOrderSort } from '@leaa/common/src/dtos/_common';

import { IRouteItem } from './router.interface';

export interface ITablePagination {
  count?: number;
  total?: number;
  pageCount?: number;
  page?: number;
  pageSize?: number;
  orderBy?: any;
  orderSort?: IOrderSort;
}

export interface IPage extends RouteComponentProps {
  route: IRouteItem;
}
