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
      users: checkPermission('user.list'),
      user: checkPermission('user.item'),
      //
      roles: checkPermission('role.list'),
      role: checkPermission('role.item'),
      //
      permissions: checkPermission('permission.list'),
      permission: checkPermission('permission.item'),
      //
      categories: checkPermission('category.list'),
      category: checkPermission('category.item'),
      //
      articles: checkPermission('article.list'),
      article: checkPermission('article.item'),
      //
      axs: allow,
      ax: allow,
    },
    Mutation: {
      login: allow,
      register: allow,
      //
      createUser: checkPermission('user.create'),
      updateUser: checkPermission('user.update'),
      deleteUser: checkPermission('user.delete'),
      //
      createRole: checkPermission('role.create'),
      updateRole: checkPermission('role.update'),
      deleteRole: checkPermission('role.delete'),
      //
      createPermission: checkPermission('permission.create'),
      updatePermission: checkPermission('permission.update'),
      deletePermission: checkPermission('permission.delete'),
      //
      createCategory: checkPermission('category.create'),
      updateCategory: checkPermission('category.update'),
      deleteCategory: checkPermission('category.delete'),
      //
      createArticle: checkPermission('article.create'),
      updateArticle: checkPermission('article.update'),
      deleteArticle: checkPermission('article.delete'),
      //
      createAx: checkPermission('ax.create'),
      updateAx: checkPermission('ax.update'),
      deleteAx: checkPermission('ax.delete'),
    },
  },
  {
    allowExternalErrors: envConfig.NODE_ENV !== 'production',
  },
);
