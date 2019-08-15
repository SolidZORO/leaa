import { rule } from 'graphql-shield';
import jsonwebtoken from 'jsonwebtoken';

import { envConfig } from '@leaa/api/modules/config/config.module';

export const hasRole = (allowedRoles: string) =>
  rule(`has-role-${allowedRoles}`)(async (parent, args, context, info) => {
    const { authorization } = context.req.headers;

    const token = authorization.replace('Bearer ', '');

    try {
      const { role }: any = jsonwebtoken.verify(token, envConfig.JWT_SECRET_KEY);

      return allowedRoles.includes(role);
    } catch {
      return false;
    }
  });

export const roleConfig = {
  hasRole,
};
