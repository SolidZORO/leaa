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
// users       --> user.list-read
// user        --> user.item-read
// createUser  --> user.item-create
// updateUser  --> user.item-update
// deleteUser  --> user.item-delete

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
  'tags',
  'tag',
];

// TIPS relation file: packages/leaa-api/src/modules/seed/seed.data.ts
export const permissions = shield(
  {
    Query: {
      userByToken: allow,
      users: checkPermission('user.list-read'),
      user: checkPermission('user.item-read'),
      //
      roles: checkPermission('role.list-read'),
      role: checkPermission('role.item-read'),
      //
      permissions: checkPermission('permission.list-read'),
      permission: checkPermission('permission.item-read'),
      //
      categories: checkPermission('category.list-read'),
      categoriesByTree: checkPermission('category.list-read'),
      category: checkPermission('category.item-read'),
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
      //
      tags: allow,
      tag: allow,
      //
      coupons: allow,
      coupon: allow,
      //
      promos: checkPermission('promo.list-read'),
      promo: allow,
    },
    Mutation: {
      login: allow,
      loginByTicket: allow,
      signup: allow,
      //
      createUser: checkPermission('user.item-create'),
      updateUser: checkPermission('user.item-update'),
      deleteUser: checkPermission('user.item-delete'),
      //
      createRole: checkPermission('role.item-create'),
      updateRole: checkPermission('role.item-update'),
      deleteRole: checkPermission('role.item-delete'),
      //
      createPermission: checkPermission('permission.item-create'),
      updatePermission: checkPermission('permission.item-update'),
      deletePermission: checkPermission('permission.item-delete'),
      //
      createCategory: checkPermission('category.item-create'),
      updateCategory: checkPermission('category.item-update'),
      deleteCategory: checkPermission('category.item-delete'),
      //
      createArticle: checkPermission('article.item-create'),
      updateArticle: checkPermission('article.item-update'),
      deleteArticle: checkPermission('article.item-delete'),
      //
      createAx: checkPermission('ax.item-create'),
      updateAx: checkPermission('ax.item-update'),
      deleteAx: checkPermission('ax.item-delete'),
      //
      updateAttachment: checkPermission('attachment.item-update'),
      updateAttachments: checkPermission('attachment.item-update'),
      deleteAttachments: checkPermission('attachment.item-delete'),
      //
      createSetting: checkPermission('setting.item-create'),
      updateSetting: checkPermission('setting.item-update'),
      deleteSetting: checkPermission('setting.item-delete'),
      //
      createTag: checkPermission('tag.item-create'),
      updateTag: checkPermission('tag.item-update'),
      deleteTag: checkPermission('tag.item-delete'),
      //
      createCoupon: checkPermission('coupon.item-create'),
      updateCoupon: checkPermission('coupon.item-update'),
      deleteCoupon: checkPermission('coupon.item-delete'),
      redeemCoupon: allow,
      //
      createPromo: checkPermission('promo.item-create'),
      updatePromo: checkPermission('promo.item-update'),
      deletePromo: checkPermission('promo.item-delete'),
      redeemPromo: allow,
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
