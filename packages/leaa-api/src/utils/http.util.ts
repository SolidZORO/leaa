import { IRequest, IGqlCtx } from '@leaa/api/src/interfaces';

const getGqlCtxFromReq = (req: IRequest): IGqlCtx => ({
  user: req.user,
  lang: req.headers?.lang,
});

export const httpUtil = {
  getGqlCtxFromReq,
};
