import { User } from '@leaa/common/src/entrys';
import { IRequest } from '@leaa/api/src/interfaces/express.interface';

export interface IGqlCtx {
  user?: User;
  lang?: string;
  req?: IRequest;
}
