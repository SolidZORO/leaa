import { createParamDecorator } from '@nestjs/common';

export const UserDecorator = createParamDecorator((data, [root, args, ctx, info]) => ctx.user);
