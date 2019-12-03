import _ from 'lodash';
import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';

import { IRouteItem, IPage } from '@leaa/dashboard/src/interfaces';
import { ALLOW_PERMISSION } from '@leaa/dashboard/src/constants';

import { MasterLayout, SuspenseFallback } from '@leaa/dashboard/src/components';

// TIPS: permission: 'ALLOW_PERMISSION' will be always display

export const masterRoutes: IRouteItem[] = [
  //
  // -------- [Content Group] --------
  //
  {
    name: 'Content Group',
    namei18n: '_route:contentGroup',
    permission: 'article.list-read | tag.list-read',
    path: '_content-group',
    icon: 'ri-archive-line',
    children: [
      // ---- Article ----
      {
        name: 'Create Article',
        namei18n: '_route:createArticle',
        permission: 'article.item-create',
        path: '/articles/create',
        icon: 'ri-file-list-2-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CreateArticle' */ '../pages/Article/CreateArticle/CreateArticle'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Article',
        namei18n: '_route:editArticle',
        permission: 'article.item-read',
        path: '/articles/:id(\\d+)',
        icon: 'ri-file-list-2-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'EditArticle' */ '../pages/Article/EditArticle/EditArticle'),
        ),
        exact: true,
      },
      {
        name: 'Article',
        namei18n: '_route:article',
        permission: 'article.list-read',
        path: '/articles',
        icon: 'ri-file-list-2-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'ArticleList' */ '../pages/Article/ArticleList/ArticleList'),
        ),
        canCreate: true,
        exact: true,
      },
      // ---- Tag ----
      {
        name: 'Create Tag',
        namei18n: '_route:createTag',
        permission: 'tag.item-create',
        path: '/tags/create',
        icon: 'ri-price-tag-3-line',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'CreateTag' */ '../pages/Tag/CreateTag/CreateTag')),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Tag',
        namei18n: '_route:editTag',
        permission: 'tag.item-read',
        path: '/tags/:id(\\d+)',
        icon: 'ri-price-tag-3-line',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'EditTag' */ '../pages/Tag/EditTag/EditTag')),
        exact: true,
      },
      {
        name: 'Tag',
        namei18n: '_route:tag',
        permission: 'tag.list-read',
        path: '/tags',
        icon: 'ri-price-tag-3-line',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'TagList' */ '../pages/Tag/TagList/TagList')),
        canCreate: true,
        exact: true,
      },
    ],
  },
  // -------- [User Group] --------
  {
    name: 'User Group',
    namei18n: '_route:userGroup',
    permission: 'user.list-read | role.list-read | permission.list-read',
    path: '_user-group',
    icon: 'ri-shield-user-line',
    children: [
      // ---- User ----
      {
        name: 'Create User',
        namei18n: '_route:createUser',
        permission: 'user.item-create',
        path: '/users/create',
        icon: 'ri-user-3-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CreateUser' */ '../pages/User/CreateUser/CreateUser'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit User',
        namei18n: '_route:editUser',
        permission: 'user.item-read',
        path: '/users/:id(\\d+)',
        icon: 'ri-user-3-line',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'EditUser' */ '../pages/User/EditUser/EditUser')),
        exact: true,
      },
      {
        name: 'User',
        namei18n: '_route:user',
        permission: 'user.list-read',
        path: '/users',
        icon: 'ri-user-3-line',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'UserList' */ '../pages/User/UserList/UserList')),
        canCreate: true,
        exact: true,
      },
      // ---- Role ----
      {
        name: 'Create Role',
        namei18n: '_route:createRole',
        permission: 'role.item-create',
        path: '/roles/create',
        icon: 'ri-vip-crown-2-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CreateRole' */ '../pages/Role/CreateRole/CreateRole'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Role',
        namei18n: '_route:editRole',
        permission: 'role.item-read',
        path: '/roles/:id(\\d+)',
        icon: 'ri-vip-crown-2-line',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'EditRole' */ '../pages/Role/EditRole/EditRole')),
        exact: true,
      },
      {
        name: 'Role',
        namei18n: '_route:role',
        permission: 'role.list-read',
        path: '/roles',
        icon: 'ri-vip-crown-2-line',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'RoleList' */ '../pages/Role/RoleList/RoleList')),
        canCreate: true,
        exact: true,
      },
      // ---- Permission ----
      {
        name: 'Create Permission',
        namei18n: '_route:createPermission',
        permission: 'permission.item-create',
        path: '/permissions/create',
        icon: 'ri-lock-2-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CreatePermission' */ '../pages/Permission/CreatePermission/CreatePermission'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Permission',
        namei18n: '_route:editPermission',
        permission: 'permission.item-read',
        path: '/permissions/:id(\\d+)',
        icon: 'ri-lock-2-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'EditPermission' */ '../pages/Permission/EditPermission/EditPermission'),
        ),
        exact: true,
      },
      {
        name: 'Permission',
        namei18n: '_route:permission',
        permission: 'permission.list-read',
        path: '/permissions',
        icon: 'ri-lock-2-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'PermissionList' */ '../pages/Permission/PermissionList/PermissionList'),
        ),
        canCreate: true,
        exact: true,
      },
    ],
  },
  //
  // -------- [Marketing Group] --------
  //
  {
    name: 'Marketing Group',
    namei18n: '_route:marketingGroup',
    permission: 'coupon.list-read | ax.list-read | promo.list-read',
    path: '_marketing-group',
    icon: 'ri-voiceprint-line',
    children: [
      // ---- Ax ----
      {
        name: 'Create Ax',
        namei18n: '_route:createAx',
        permission: 'ax.item-create',
        path: '/axs/create',
        icon: 'ri-paint-brush-line',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'CreateAx' */ '../pages/Ax/CreateAx/CreateAx')),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Ax',
        namei18n: '_route:editAx',
        permission: 'ax.item-read',
        path: '/axs/:id(\\d+)',
        icon: 'ri-paint-brush-line',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'EditAx' */ '../pages/Ax/EditAx/EditAx')),
        exact: true,
      },
      {
        name: 'Ax',
        namei18n: '_route:ax',
        permission: 'ax.list-read',
        path: '/axs',
        icon: 'ri-paint-brush-line',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'AxList' */ '../pages/Ax/AxList/AxList')),
        canCreate: true,
        exact: true,
      },
      // ---- Coupon ----
      {
        name: 'redeem Coupon',
        namei18n: '_route:redeemCoupon',
        permission: 'coupon.redeem-item',
        path: '/coupons/redeem',
        icon: 'ri-coupon-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'RedeemCoupon' */ '../pages/Coupon/RedeemCoupon/RedeemCoupon'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Create Coupon',
        namei18n: '_route:createCoupon',
        permission: 'coupon.item-create',
        path: '/coupons/create',
        icon: 'ri-coupon-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CreateCoupon' */ '../pages/Coupon/CreateCoupon/CreateCoupon'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Coupon',
        namei18n: '_route:editCoupon',
        permission: 'coupon.item-read',
        path: '/coupons/:id(\\d+)',
        icon: 'ri-coupon-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'EditCoupon' */ '../pages/Coupon/EditCoupon/EditCoupon'),
        ),
        exact: true,
      },
      {
        name: 'Coupon',
        namei18n: '_route:coupon',
        permission: 'coupon.list-read',
        path: '/coupons',
        icon: 'ri-coupon-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CouponList' */ '../pages/Coupon/CouponList/CouponList'),
        ),
        canCreate: true,
        exact: true,
      },
      // ---- Promo ----
      {
        name: 'Create Promo',
        namei18n: '_route:createPromo',
        permission: 'promo.item-create',
        path: '/promos/create',
        icon: 'ri-coupon-3-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CreatePromo' */ '../pages/Promo/CreatePromo/CreatePromo'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Promo',
        namei18n: '_route:editPromo',
        permission: 'promo.item-read',
        path: '/promos/:id(\\d+)',
        icon: 'ri-coupon-3-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'EditPromo' */ '../pages/Promo/EditPromo/EditPromo'),
        ),
        exact: true,
      },
      {
        name: 'Promo',
        namei18n: '_route:promo',
        permission: 'promo.list-read',
        path: '/promos',
        icon: 'ri-coupon-3-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'PromoList' */ '../pages/Promo/PromoList/PromoList'),
        ),
        canCreate: true,
        exact: true,
      },
    ],
  },
  //
  // ---- Category ----
  //
  {
    name: 'Create Category',
    namei18n: '_route:createCategory',
    permission: 'category.item-create',
    path: '/categories/create',
    icon: 'ri-function-line',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'CreateCategory' */ '../pages/Category/CreateCategory/CreateCategory'),
    ),
    exact: true,
    isCreate: true,
  },
  {
    name: 'Edit Category',
    namei18n: '_route:editCategory',
    permission: 'category.item-read',
    path: '/categories/:id(\\d+)',
    icon: 'ri-function-line',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'EditCategory' */ '../pages/Category/EditCategory/EditCategory'),
    ),
    exact: true,
  },
  {
    name: 'Category',
    namei18n: '_route:category',
    permission: 'category.list-read',
    path: '/categories',
    icon: 'ri-function-line',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'CategoryList' */ '../pages/Category/CategoryList/CategoryList'),
    ),
    canCreate: true,
    exact: true,
  },
  //
  // ---- Setting ----
  //
  {
    name: 'Setting',
    namei18n: '_route:setting',
    permission: 'setting.list-read',
    path: '/settings',
    icon: 'ri-settings-line',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'SettingList' */ '../pages/Setting/SettingList/SettingList'),
    ),
    exact: true,
  },
  //
  // ---- Home ----
  //
  {
    name: 'Home',
    namei18n: '_route:home',
    permission: ALLOW_PERMISSION,
    path: '/',
    LazyComponent: React.lazy(() => import(/* webpackChunkName: 'Home' */ '../pages/Home/Home/Home')),
    exact: true,
  },
  //
  // -------- [Debug Group] --------
  //
  {
    name: 'Debug Group',
    namei18n: '_route:debug',
    permission: 'lab.root',
    path: '_debug-group',
    icon: 'ri-terminal-box-line',
    children: [
      {
        name: 'Test Any',
        namei18n: '_route:testAny',
        permission: ALLOW_PERMISSION,
        path: '/test-any',
        icon: 'ri-code-s-slash-line',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'TestAny' */ '../pages/Test/TestAny/TestAny')),
        exact: true,
      },
      {
        name: 'Test Attachment',
        namei18n: '_route:testAttachment',
        permission: ALLOW_PERMISSION,
        path: '/test-attachment',
        icon: 'ri-code-s-slash-line',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'TestAttachment' */ '../pages/Test/TestAttachment/TestAttachment'),
        ),
        exact: true,
      },
      {
        name: 'Test I18n',
        namei18n: '_route:testI18n',
        permission: ALLOW_PERMISSION,
        path: '/test-i18n',
        icon: 'ri-code-s-slash-line',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'TestI18n' */ '../pages/Test/TestI18n/TestI18n')),
        exact: true,
      },
    ],
  },
];

const routerDom: ReactNode[] = [];
const parseRoutes = (routeList: IRouteItem[]) => {
  routeList.forEach(item => {
    if (item.children) {
      parseRoutes(item.children);
    }

    routerDom.push(
      <Route key={item.children ? `group-${item.name}` : item.path} exact={item.exact} path={item.path}>
        <MasterLayout
          route={item}
          component={(matchProps: IPage) => (
            <React.Suspense fallback={<SuspenseFallback />}>
              {item.LazyComponent && <item.LazyComponent {...matchProps} />}
            </React.Suspense>
          )}
        />
      </Route>,
    );
  });

  return routerDom;
};

const flateRoutes: IRouteItem[] = [];
const parseFlatRoutes = (routeList: IRouteItem[], groupName?: string) => {
  routeList.forEach(item => {
    const nextItem = _.omit(item, 'LazyComponent');

    if (nextItem.children) {
      parseFlatRoutes(nextItem.children, nextItem.path);
    }

    // loop for children groupName
    if (groupName) {
      nextItem.groupName = groupName;
    }

    flateRoutes.push(nextItem);
  });

  return flateRoutes;
};

export const masterRoute = parseRoutes(masterRoutes);
export const flateMasterRoutes = parseFlatRoutes(masterRoutes);
