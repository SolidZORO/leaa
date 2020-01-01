import { shield, allow, rule } from 'graphql-shield';

import { IPermissionSlug } from '@leaa/common/src/interfaces';

const checkPermission = (permissionSlug: IPermissionSlug) => {
  return rule()((parent, args, ctx) => ctx.user.flatPermissions.includes(permissionSlug));
};

// permissions names e.g.
// ----------------------
// users       --> user.list-read
// user        --> user.item-read
// createUser  --> user.item-create
// updateUser  --> user.item-update
// deleteUser  --> user.item-delete

export const notValidateUserQuerys = [
  'ram',
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
  'products',
  'product',
  'attachments',
  'attachment',
  'settings',
  'setting',
  'tags',
  'tag',
];

const pQuery = {} as any;
const pMutation = {} as any;

//
// --------------------
pMutation.login = allow;
pMutation.loginByTicket = allow;
pMutation.signup = allow;
//
// --------------------
pQuery.userByToken = allow;
pQuery.users = checkPermission('user.list-read');
pQuery.user = checkPermission('user.item-read');
//
pMutation.createUser = checkPermission('user.item-create');
pMutation.updateUser = checkPermission('user.item-update');
pMutation.deleteUser = checkPermission('user.item-delete');
//
// --------------------
pQuery.roles = checkPermission('role.list-read');
pQuery.role = checkPermission('role.item-read');
//
pMutation.createRole = checkPermission('role.item-create');
pMutation.updateRole = checkPermission('role.item-update');
pMutation.deleteRole = checkPermission('role.item-delete');
//
// --------------------
pQuery.permissions = checkPermission('permission.list-read');
pQuery.permission = checkPermission('permission.item-read');
//
pMutation.createPermission = checkPermission('permission.item-create');
pMutation.updatePermission = checkPermission('permission.item-update');
pMutation.deletePermission = checkPermission('permission.item-delete');
//
// --------------------
pQuery.categories = checkPermission('category.list-read');
pQuery.category = checkPermission('category.item-read');
//
pMutation.createCategory = checkPermission('category.item-create');
pMutation.updateCategory = checkPermission('category.item-update');
pMutation.deleteCategory = checkPermission('category.item-delete');
//
// --------------------
pQuery.articles = allow;
pQuery.article = allow;
//
pMutation.createArticle = checkPermission('article.item-create');
pMutation.updateArticle = checkPermission('article.item-update');
pMutation.deleteArticle = checkPermission('article.item-delete');
//
// --------------------
pQuery.axs = allow;
pQuery.ax = allow;
pQuery.axBySlug = allow;
//
pMutation.createAx = checkPermission('ax.item-create');
pMutation.updateAx = checkPermission('ax.item-update');
pMutation.deleteAx = checkPermission('ax.item-delete');
//
// --------------------
pQuery.attachments = allow;
pQuery.attachment = allow;
//
pMutation.updateAttachment = checkPermission('attachment.item-update');
pMutation.updateAttachments = checkPermission('attachment.item-update');
pMutation.deleteAttachments = checkPermission('attachment.item-delete');
//
// --------------------
pQuery.settings = allow;
pQuery.setting = allow;
//
pMutation.createSetting = checkPermission('setting.item-create');
pMutation.updateSetting = checkPermission('setting.item-update');
pMutation.deleteSetting = checkPermission('setting.item-delete');
//
// --------------------
pQuery.tags = allow;
pQuery.tag = allow;
//
pMutation.createTag = checkPermission('tag.item-create');
pMutation.updateTag = checkPermission('tag.item-update');
pMutation.deleteTag = checkPermission('tag.item-delete');
//
// --------------------
pQuery.coupons = allow;
pQuery.coupon = allow;
//
pMutation.createCoupon = checkPermission('coupon.item-create');
pMutation.updateCoupon = checkPermission('coupon.item-update');
pMutation.deleteCoupon = checkPermission('coupon.item-delete');
pMutation.redeemCoupon = allow;
//
// --------------------
pQuery.promos = checkPermission('promo.list-read');
pQuery.promo = allow;
//
pMutation.createPromo = checkPermission('promo.item-create');
pMutation.updatePromo = checkPermission('promo.item-update');
pMutation.deletePromo = checkPermission('promo.item-delete');
pMutation.redeemPromo = allow;
//
// --------------------
pQuery.products = allow;
pQuery.product = allow;
//
pMutation.createProduct = checkPermission('product.item-create');
pMutation.updateProduct = checkPermission('product.item-update');
pMutation.deleteProduct = checkPermission('product.item-delete');
//
// --------------------
pQuery.addresses = allow;
pQuery.address = allow;
//
pMutation.createAddress = checkPermission('address.item-create');
pMutation.updateAddress = checkPermission('address.item-update');
pMutation.deleteAddress = checkPermission('address.item-delete');

// TIPS relation file: packages/leaa-api/src/modules/seed/seed.data.ts
export const permissions = shield(
  {
    Query: pQuery,
    Mutation: pMutation,
  },
  {
    allowExternalErrors: process.env.NODE_ENV !== 'production',
  },
);

export const permissionConfig = {
  permissions,
  notValidateUserQuerys,
};
