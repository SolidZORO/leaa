import { shield, allow, rule } from 'graphql-shield';

const checkPermission = (permissionSlug: string) => {
  return rule()(async (parent, args, ctx) => ctx.user.flatePermissions.includes(permissionSlug));
  // return rule()(async (parent, args, ctx) => {
  //   console.log(ctx);
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

export const notValidateUserQuerys = [
  'IntrospectionQuery',
  //
  'login',
  'loginByTicket',
  'register',
  'signup',
  'userByToken',
  //
  'ax',
  'axs',
  'axBySlug',
  'articles',
  'article',
  'attachments',
  'attachment',
  'settings',
  'setting',
];

export const permissions = shield(
  {
    Query: {
      userByToken: allow,
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
      categoriesByTree: checkPermission('category.list'),
      category: checkPermission('category.item'),
      //
      articles: allow,
      article: allow,
      //
      axs: allow,
      ax: allow,
      axBySlug: allow,
      //
      attachments: allow,
      attachment: allow,
      //
      settings: allow,
      setting: allow,
    },
    Mutation: {
      login: allow,
      loginByTicket: allow,
      signup: allow,
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
      //
      updateAttachment: checkPermission('attachment.update'),
      updateAttachments: checkPermission('attachment.update'),
      deleteAttachments: checkPermission('attachment.delete'),
      //
      createSetting: checkPermission('setting.create'),
      updateSetting: checkPermission('setting.update'),
      deleteSetting: checkPermission('setting.delete'),
    },
  },
  {
    allowExternalErrors: process.env.NODE_ENV !== 'production',
  },
);

export const permissionConfig = {
  permissions,
  notValidateUserQuerys,
};
