import { User } from '@leaa/common/src/entrys';
import { IRequest } from '@leaa/api/src/interfaces/http.interface';
import { TFunction } from 'i18next';

export interface IGqlCtx {
  user?: User;
  lang?: string;
  req?: IRequest;
  t: TFunction | Function;
}
