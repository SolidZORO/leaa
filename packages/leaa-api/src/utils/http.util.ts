import { IRequest, IGqlCtx } from '@leaa/api/src/interfaces';

const getGqlCtxFromReq = (req: IRequest): IGqlCtx => ({
  user: req.user,
  lang: req.headers.lang as string,
});

export const httpUtil = {
  getGqlCtxFromReq,
};
