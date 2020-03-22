import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, executionCtx: ExecutionContext) => {
  const [, , ctx] = executionCtx.getArgs();

  return ctx?.user;
});
