import { IRequest, IGqlCtx } from '@leaa/api/src/interfaces';

export const getGqlCtxFromReq = (req: IRequest): IGqlCtx => ({
  user: req.user,
  lang: req.headers?.lang,
});
