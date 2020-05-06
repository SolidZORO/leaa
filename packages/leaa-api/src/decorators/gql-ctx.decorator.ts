import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GqlCtx = createParamDecorator((data: unknown, executionCtx: ExecutionContext) => {
  const [, , ctx] = executionCtx.getArgs();

  // ctx from GraphqlService context
  return {
    user: ctx?.user,
    lang: ctx?.lang,
    req: ctx?.req,
  };
});
