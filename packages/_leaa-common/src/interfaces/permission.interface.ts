declare const permissionSlug: [
  'playground.root',
  'test.root',
  'lab.root',
  'user.list-read',
  'user.list-read--all-user-id',
  'user.list-read--all-status',
  //
  'user.item-read',
  'user.item-read--all-user-id',
  'user.item-read--all-status',
  'user.item-create',
  'user.item-update',
  'user.item-delete',
  // --------------------
  'role.list-read',
  'role.list-read--all-user-id',
  //
  'role.item-read',
  'role.item-read--all-user-id',
  'role.item-create',
  'role.item-update',
  'role.item-delete',
  // --------------------
  'permission.list-read',
  'permission.list-read--all-user-id',
  //
  'permission.item-read',
  'permission.item-read--all-user-id',
  'permission.item-create',
  'permission.item-update',
  'permission.item-delete',
  // --------------------
  'category.list-read',
  //
  'category.item-read',
  'category.item-create',
  'category.item-update',
  'category.item-delete',
  // --------------------
  'article.list-read',
  'article.list-read--all-user-id',
  'article.list-read--all-status',
  //
  'article.item-read',
  'article.item-read--all-user-id',
  'article.item-read--all-status',
  'article.item-create',
  'article.item-update',
  'article.item-delete',
  // --------------------
  'ax.list-read',
  'ax.list-read--all-status',
  //
  'ax.item-read',
  'ax.item-read--all-status',
  'ax.item-create',
  'ax.item-update',
  'ax.item-delete',
  // --------------------
  'tag.list-read',
  //
  'tag.item-read',
  'tag.item-create',
  'tag.item-update',
  'tag.item-delete',
  // --------------------
  'attachment.list-read',
  'attachment.list-read--all-status',
  //
  'attachment.item-read',
  'attachment.item-read--all-status',
  'attachment.item-create',
  'attachment.item-update',
  'attachment.item-delete',
  // --------------------
  'setting.list-read',
  'setting.list-read--private',
  //
  'setting.item-read',
  'setting.item-read--private',
  'setting.item-create',
  'setting.item-update',
  'setting.item-delete',
  // --------------------
  'coupon.list-read',
  'coupon.list-read--all-user-id',
  'coupon.list-read--all-status',
  //
  'coupon.item-read',
  'coupon.item-read--all-user-id',
  'coupon.item-read--all-status',
  'coupon.item-create',
  'coupon.item-update',
  'coupon.item-delete',
  'coupon.item-redeem',
  'coupon.item-redeem--to-all-user-id',
  // --------------------
  'promo.list-read',
  'promo.list-read--all-status',
  //
  'promo.item-read',
  'promo.item-read--all-status',
  'promo.item-create',
  'promo.item-update',
  'promo.item-delete',
  'promo.item-redeem',
  'promo.item-redeem--to-all-user-id',
  // --------------------
  'product.list-read',
  'product.list-read--all-status',
  //
  'product.item-read',
  'product.item-read--all-status',
  'product.item-create',
  'product.item-update',
  'product.item-delete',
  // --------------------
  'address.list-read',
  'address.list-read--all-users',
  //
  'address.item-read',
  'address.item-read--all-users',
  'address.item-create',
  'address.item-update',
  'address.item-delete',
  // --------------------
  'division.list-read',
  //
  'division.item-read',
  'division.item-create',
  'division.item-update',
  'division.item-delete',
];

export declare type IPermissionSlug = typeof permissionSlug[number];
