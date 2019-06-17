import { shield, allow, rule } from 'graphql-shield';

import { User } from '@leaa/common/entrys';
import { envConfig } from '../modules/config/config.module';

const getFlatPermissions = (user: User): string[] => {
  if (!user) {
    return [];
  }

  if (!user.permissions) {
    return [];
  }

  if (user.permissions.length && user.permissions.length < 1) {
    return [];
  }

  return user.permissions.map(p => p.slug);
};

export const permissions = shield(
  {
    Query: {
      user: rule()(async (parent, args, ctx) => getFlatPermissions(ctx.user).includes('user.edit')),
      users: rule()(async (parent, args, ctx) => getFlatPermissions(ctx.user).includes('user.edit111')),
    },
    Mutation: {
      login: allow,
      createUser: allow,
      updateUser: allow,
    },
  },
  {
    allowExternalErrors: envConfig.NODE_ENV !== 'production',
  },
);
