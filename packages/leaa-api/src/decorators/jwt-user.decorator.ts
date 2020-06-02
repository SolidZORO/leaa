import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@leaa/common/src/entrys';

export const JwtUser = createParamDecorator(
  (data: unknown, executionCtx: ExecutionContext): User => {
    const [req] = executionCtx.getArgs();

    return req.user;
  },
);
