import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Language = createParamDecorator((data: unknown, executionCtx: ExecutionContext) => {
  const [, , ctx] = executionCtx.getArgs();

  return ctx?.headers?.lang;
});
