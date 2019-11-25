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
    permission: 'article.list | tag.list',
    path: '_content-group',
    icon: 'x-content-group',
    children: [
      // ---- Article ----
      {
        name: 'Create Article',
        namei18n: '_route:createArticle',
        permission: 'article.create',
        path: '/articles/create',
        icon: 'x-document',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CreateArticle' */ '../pages/Article/CreateArticle/CreateArticle'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Article',
        namei18n: '_route:editArticle',
        permission: 'article.item',
        path: '/articles/:id(\\d+)',
        icon: 'x-document',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'EditArticle' */ '../pages/Article/EditArticle/EditArticle'),
        ),
        exact: true,
      },
      {
        name: 'Article',
        namei18n: '_route:article',
        permission: 'article.list',
        path: '/articles',
        icon: 'x-document',
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
        permission: 'tag.create',
        path: '/tags/create',
        icon: 'x-tag',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'CreateTag' */ '../pages/Tag/CreateTag/CreateTag')),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Tag',
        namei18n: '_route:editTag',
        permission: 'tag.item',
        path: '/tags/:id(\\d+)',
        icon: 'x-tag',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'EditTag' */ '../pages/Tag/EditTag/EditTag')),
        exact: true,
      },
      {
        name: 'Tag',
        namei18n: '_route:tag',
        permission: 'tag.list',
        path: '/tags',
        icon: 'x-tag',
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
    permission: 'user.list | role.list | permission.list',
    path: '_user-group',
    icon: 'x-usergroup',
    children: [
      // ---- User ----
      {
        name: 'Create User',
        namei18n: '_route:createUser',
        permission: 'user.create',
        path: '/users/create',
        icon: 'x-user2',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CreateUser' */ '../pages/User/CreateUser/CreateUser'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit User',
        namei18n: '_route:editUser',
        permission: 'user.item',
        path: '/users/:id(\\d+)',
        icon: 'x-user2',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'EditUser' */ '../pages/User/EditUser/EditUser')),
        exact: true,
      },
      {
        name: 'User',
        namei18n: '_route:user',
        permission: 'user.list',
        path: '/users',
        icon: 'x-user2',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'UserList' */ '../pages/User/UserList/UserList')),
        canCreate: true,
        exact: true,
      },
      // ---- Role ----
      {
        name: 'Create Role',
        namei18n: '_route:createRole',
        permission: 'role.create',
        path: '/roles/create',
        icon: 'x-role',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CreateRole' */ '../pages/Role/CreateRole/CreateRole'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Role',
        namei18n: '_route:editRole',
        permission: 'role.item',
        path: '/roles/:id(\\d+)',
        icon: 'x-role',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'EditRole' */ '../pages/Role/EditRole/EditRole')),
        exact: true,
      },
      {
        name: 'Role',
        namei18n: '_route:role',
        permission: 'role.list',
        path: '/roles',
        icon: 'x-role',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'RoleList' */ '../pages/Role/RoleList/RoleList')),
        canCreate: true,
        exact: true,
      },
      // ---- Permission ----
      {
        name: 'Create Permission',
        namei18n: '_route:createPermission',
        permission: 'permission.create',
        path: '/permissions/create',
        icon: 'x-permission2',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CreatePermission' */ '../pages/Permission/CreatePermission/CreatePermission'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Permission',
        namei18n: '_route:editPermission',
        permission: 'permission.item',
        path: '/permissions/:id(\\d+)',
        icon: 'x-permission2',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'EditPermission' */ '../pages/Permission/EditPermission/EditPermission'),
        ),
        exact: true,
      },
      {
        name: 'Permission',
        namei18n: '_route:permission',
        permission: 'permission.list',
        path: '/permissions',
        icon: 'x-permission2',
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
    permission: 'coupon.list | ax.list',
    path: '_marketing-group',
    icon: 'x-marketing',
    children: [
      // ---- Ax ----
      {
        name: 'Create Ax',
        namei18n: '_route:createAx',
        permission: 'ax.create',
        path: '/axs/create',
        icon: 'x-pic',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'CreateAx' */ '../pages/Ax/CreateAx/CreateAx')),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Ax',
        namei18n: '_route:editAx',
        permission: 'ax.item',
        path: '/axs/:id(\\d+)',
        icon: 'x-pic',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'EditAx' */ '../pages/Ax/EditAx/EditAx')),
        exact: true,
      },
      {
        name: 'Ax',
        namei18n: '_route:ax',
        permission: 'ax.list',
        path: '/axs',
        icon: 'x-pic',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'AxList' */ '../pages/Ax/AxList/AxList')),
        canCreate: true,
        exact: true,
      },
      // ---- Coupon ----
      {
        name: 'Create Coupon',
        namei18n: '_route:createCoupon',
        permission: 'coupon.create',
        path: '/coupons/create',
        icon: 'x-coupon',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CreateCoupon' */ '../pages/Coupon/CreateCoupon/CreateCoupon'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Coupon',
        namei18n: '_route:editCoupon',
        permission: 'coupon.item',
        path: '/coupons/:id(\\d+)',
        icon: 'x-coupon',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'EditCoupon' */ '../pages/Coupon/EditCoupon/EditCoupon'),
        ),
        exact: true,
      },
      {
        name: 'Coupon',
        namei18n: '_route:coupon',
        permission: 'coupon.list',
        path: '/coupons',
        icon: 'x-coupon',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CouponList' */ '../pages/Coupon/CouponList/CouponList'),
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
    permission: 'category.create',
    path: '/categories/create',
    icon: 'x-category',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'CreateCategory' */ '../pages/Category/CreateCategory/CreateCategory'),
    ),
    exact: true,
    isCreate: true,
  },
  {
    name: 'Edit Category',
    namei18n: '_route:editCategory',
    permission: 'category.item',
    path: '/categories/:id(\\d+)',
    icon: 'x-category',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'EditCategory' */ '../pages/Category/EditCategory/EditCategory'),
    ),
    exact: true,
  },
  {
    name: 'Category',
    namei18n: '_route:category',
    permission: 'category.list',
    path: '/categories',
    icon: 'x-category',
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
    permission: 'setting.list',
    path: '/settings',
    icon: 'x-setting',
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
    icon: 'x-diamond',
    children: [
      {
        name: 'Test Any',
        namei18n: '_route:testAny',
        permission: ALLOW_PERMISSION,
        path: '/test-any',
        icon: 'x-numbersign',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'TestAny' */ '../pages/Test/TestAny/TestAny')),
        exact: true,
      },
      {
        name: 'Test Attachment',
        namei18n: '_route:testAttachment',
        permission: ALLOW_PERMISSION,
        path: '/test-attachment',
        icon: 'x-numbersign',
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
        icon: 'x-numbersign',
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
