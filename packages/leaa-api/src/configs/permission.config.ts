import { shield, allow, rule } from 'graphql-shield';
import { envConfig } from '../modules/config/config.module';

const checkPermission = (permissionSlug: string) => {
  return rule()(async (parent, args, ctx) => ctx.user.flatePermissions.includes(permissionSlug));
  // return rule()(async (parent, args, ctx) => {
  //   console.log(ctx.user);
  //   return ctx.user.flatePermissions.includes(permissionSlug);
  // });
};

// permissions names e.g.
// ----------------------
// users       --> user.list
// user        --> user.item
// createUser  --> user.create
// updateUser  --> user.update
// deleteUser  --> user.delete

export const permissions = shield(
  {
    Query: {
      roles: checkPermission('role.list'),
      role: checkPermission('role.item'),
      //
      permissions: checkPermission('permission.list'),
      permission: checkPermission('permission.item'),
      //
      users: checkPermission('user.list'),
      user: checkPermission('user.item'),
    },
    Mutation: {
      login: allow,
      register: allow,
      //
      createUser: checkPermission('user.create'),
      updateUser: checkPermission('user.update'),
      deleteUser: checkPermission('user.delete'),
      //
      createPermission: checkPermission('permission.create'),
      updatePermission: checkPermission('permission.update'),
      deletePermission: checkPermission('permission.delete'),
      //
      createRole: checkPermission('role.create'),
      updateRole: checkPermission('role.update'),
      deleteRole: checkPermission('role.delete'),
    },
  },
  {
    allowExternalErrors: envConfig.NODE_ENV !== 'production',
  },
);
