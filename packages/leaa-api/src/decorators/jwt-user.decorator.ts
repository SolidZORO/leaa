import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@leaa/api/src/entrys';

export const JwtUser = createParamDecorator(
  (data: unknown, executionCtx: ExecutionContext): User => {
    const [req] = executionCtx.getArgs();

    return req.user;
  },
);
