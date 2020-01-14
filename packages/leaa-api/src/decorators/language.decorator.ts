import { createParamDecorator } from '@nestjs/common';

export const Language = createParamDecorator((data, req) => {
  const [, , ctx] = req;

  return ctx.req.headers.lang;
});
