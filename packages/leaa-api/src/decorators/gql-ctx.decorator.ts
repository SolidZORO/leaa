import { createParamDecorator } from '@nestjs/common';

export const GqlCtx = createParamDecorator((data, req) => {
  const [, , ctx] = req;

  // ctx from GraphqlService context
  return {
    user: ctx.user,
    lang: ctx.lang,
  };
});
