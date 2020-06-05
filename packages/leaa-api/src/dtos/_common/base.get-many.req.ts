export type IOrderSort = 'ASC' | 'DESC' | undefined;

export class BaseGetManyReq {
  page?: number = 1;

  pageSize?: number = 30;

  orderBy?: string = 'id';

  orderSort?: IOrderSort = 'DESC';

  // q -> query -> keyword

  q?: string;
}
