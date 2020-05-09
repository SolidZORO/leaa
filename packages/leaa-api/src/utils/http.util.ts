import { IRequest, IGqlCtx } from '@leaa/api/src/interfaces';
import i18next from 'i18next';

export const getGqlCtxFromReq = (req: IRequest): IGqlCtx => ({
  user: req.user,
  lang: req.headers?.lang,
  t: i18next.t,
});
