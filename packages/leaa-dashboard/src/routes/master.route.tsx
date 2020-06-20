import _ from 'lodash';
import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';

import { IRouteItem, IPage } from '@leaa/dashboard/src/interfaces';
import { ALLOW_PERMISSION, LOADABLE_DELAY } from '@leaa/dashboard/src/constants';

import { MasterLayout, SuspenseFallback } from '@leaa/dashboard/src/components';
import { isDebugMode } from '@leaa/dashboard/src/utils/debug.util';

// TIPS: permission: 'ALLOW_PERMISSION' will be always display

const UUID_REGX = '[\\w]{8}-[\\w]{4}-[\\w]{4}-[\\w]{4}-[\\w]{12}';

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
        LazyComponent: loadable(() =>
          pMinDelay(
            import(/* webpackChunkName: 'ArticleCreate' */ '../pages/Article/ArticleCreate/ArticleCreate'),
            LOADABLE_DELAY,
          ),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Article',
        namei18n: '_route:editArticle',
        permission: 'article.item-read',
        path: `/articles/:id(${UUID_REGX})`,
        icon: 'ri-file-list-2-line',
        LazyComponent: loadable(() =>
          pMinDelay(
            import(/* webpackChunkName: 'ArticleEdit' */ '../pages/Article/ArticleEdit/ArticleEdit'),
            LOADABLE_DELAY,
          ),
        ),
        exact: true,
      },
      {
        name: 'Article',
        namei18n: '_route:article',
        permission: 'article.list-read',
        path: '/articles',
        icon: 'ri-file-list-2-line',
        LazyComponent: loadable(() =>
          pMinDelay(
            import(/* webpackChunkName: 'ArticleList' */ '../pages/Article/ArticleList/ArticleList'),
            LOADABLE_DELAY,
          ),
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
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'TagCreate' */ '../pages/Tag/TagCreate/TagCreate'), LOADABLE_DELAY),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Tag',
        namei18n: '_route:editTag',
        permission: 'tag.item-read',
        path: `/tags/:id(${UUID_REGX})`,
        icon: 'ri-price-tag-3-line',
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'TagEdit' */ '../pages/Tag/TagEdit/TagEdit'), LOADABLE_DELAY),
        ),
        exact: true,
      },
      {
        name: 'Tag',
        namei18n: '_route:tag',
        permission: 'tag.list-read',
        path: '/tags',
        icon: 'ri-price-tag-3-line',
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'TagList' */ '../pages/Tag/TagList/TagList'), LOADABLE_DELAY),
        ),
        canCreate: true,
        exact: true,
      },
    ],
  },
  //
  // -------- [Product Group] --------
  //

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
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'UserCreate' */ '../pages/User/UserCreate/UserCreate'), LOADABLE_DELAY),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit User',
        namei18n: '_route:editUser',
        permission: 'user.item-read',
        path: `/users/:id(${UUID_REGX})`,
        icon: 'ri-user-3-line',
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'UserEdit' */ '../pages/User/UserEdit/UserEdit'), LOADABLE_DELAY),
        ),
        exact: true,
      },
      {
        name: 'User',
        namei18n: '_route:user',
        permission: 'user.list-read',
        path: '/users',
        icon: 'ri-user-3-line',
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'UserList' */ '../pages/User/UserList/UserList'), LOADABLE_DELAY),
        ),
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
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'RoleCreate' */ '../pages/Role/RoleCreate/RoleCreate'), LOADABLE_DELAY),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Role',
        namei18n: '_route:editRole',
        permission: 'role.item-read',
        path: `/roles/:id(${UUID_REGX})`,
        icon: 'ri-vip-crown-2-line',
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'RoleEdit' */ '../pages/Role/RoleEdit/RoleEdit'), LOADABLE_DELAY),
        ),
        exact: true,
      },
      {
        name: 'Role',
        namei18n: '_route:role',
        permission: 'role.list-read',
        path: '/roles',
        icon: 'ri-vip-crown-2-line',
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'RoleList' */ '../pages/Role/RoleList/RoleList'), LOADABLE_DELAY),
        ),
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
        LazyComponent: loadable(() =>
          pMinDelay(
            import(/* webpackChunkName: 'PermissionCreate' */ '../pages/Permission/PermissionCreate/PermissionCreate'),
            LOADABLE_DELAY,
          ),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Permission',
        namei18n: '_route:editPermission',
        permission: 'permission.item-read',
        path: `/permissions/:id(${UUID_REGX})`,
        icon: 'ri-lock-2-line',
        LazyComponent: loadable(() =>
          pMinDelay(
            import(/* webpackChunkName: 'PermissionEdit' */ '../pages/Permission/PermissionEdit/PermissionEdit'),
            LOADABLE_DELAY,
          ),
        ),
        exact: true,
      },
      {
        name: 'Permission',
        namei18n: '_route:permission',
        permission: 'permission.list-read',
        path: '/permissions',
        icon: 'ri-lock-2-line',
        LazyComponent: loadable(() =>
          pMinDelay(
            import(/* webpackChunkName: 'PermissionList' */ '../pages/Permission/PermissionList/PermissionList'),
            LOADABLE_DELAY,
          ),
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
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'AxCreate' */ '../pages/Ax/AxCreate/AxCreate'), LOADABLE_DELAY),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Ax',
        namei18n: '_route:editAx',
        permission: 'ax.item-read',
        path: `/axs/:id(${UUID_REGX})`,
        icon: 'ri-paint-brush-line',
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'AxEdit' */ '../pages/Ax/AxEdit/AxEdit'), LOADABLE_DELAY),
        ),
        exact: true,
      },
      {
        name: 'Ax',
        namei18n: '_route:ax',
        permission: 'ax.list-read',
        path: '/axs',
        icon: 'ri-paint-brush-line',
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'AxList' */ '../pages/Ax/AxList/AxList'), LOADABLE_DELAY),
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
    LazyComponent: loadable(() =>
      pMinDelay(
        import(/* webpackChunkName: 'CategoryCreate' */ '../pages/Category/CategoryCreate/CategoryCreate'),
        LOADABLE_DELAY,
      ),
    ),
    exact: true,
    isCreate: true,
  },
  {
    name: 'Edit Category',
    namei18n: '_route:editCategory',
    permission: 'category.item-read',
    path: `/categories/:id(${UUID_REGX})`,
    icon: 'ri-function-line',
    LazyComponent: loadable(() =>
      pMinDelay(
        import(/* webpackChunkName: 'CategoryEdit' */ '../pages/Category/CategoryEdit/CategoryEdit'),
        LOADABLE_DELAY,
      ),
    ),
    exact: true,
  },
  {
    name: 'Category',
    namei18n: '_route:category',
    permission: 'category.list-read',
    path: '/categories',
    icon: 'ri-function-line',
    LazyComponent: loadable(() =>
      pMinDelay(
        import(/* webpackChunkName: 'CategoryList' */ '../pages/Category/CategoryList/CategoryList'),
        LOADABLE_DELAY,
      ),
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
    LazyComponent: loadable(() =>
      pMinDelay(
        import(/* webpackChunkName: 'SettingList' */ '../pages/Setting/SettingList/SettingList'),
        LOADABLE_DELAY,
      ),
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
    LazyComponent: loadable(() =>
      pMinDelay(import(/* webpackChunkName: 'Home' */ '../pages/Home/Home/Home'), LOADABLE_DELAY),
    ),
    exact: true,
  },
  //
  // -------- [Data Group] --------
  //
  {
    name: 'Data Group',
    namei18n: '_route:dataGroup',
    permission: 'address.list-read',
    path: '_data-group',
    icon: 'ri-hard-drive-line',
    children: [
      // ---- Oauth ----
      {
        name: 'Oauth',
        namei18n: '_route:oauth',
        permission: 'oauth.list-read',
        path: '/oauths',
        icon: 'ri-key-2-line',
        LazyComponent: loadable(() =>
          pMinDelay(import(/* webpackChunkName: 'OauthList' */ '../pages/Oauth/OauthList/OauthList'), LOADABLE_DELAY),
        ),
        canCreate: false,
        exact: true,
      },
      // ---- Action ----
      {
        name: 'Action',
        namei18n: '_route:action',
        permission: 'action.list-read',
        path: '/actions',
        icon: 'ri-file-list-2-line',
        LazyComponent: loadable(() =>
          pMinDelay(
            import(/* webpackChunkName: 'ActionList' */ '../pages/Action/ActionList/ActionList'),
            LOADABLE_DELAY,
          ),
        ),
        // canCreate: true,
        exact: true,
      },
      {
        name: 'Edit Action',
        namei18n: '_route:editAction',
        permission: 'action.item-read',
        path: '/actions/:id(\\d+)',
        icon: 'ri-function-line',
        LazyComponent: loadable(() =>
          pMinDelay(
            import(/* webpackChunkName: 'ActionEdit' */ '../pages/Action/ActionEdit/ActionEdit'),
            LOADABLE_DELAY,
          ),
        ),
        exact: true,
      },
      // ---- Attachment ----
      {
        name: 'Attachment',
        namei18n: '_route:attachment',
        permission: 'attachment.list-read',
        path: '/attachments',
        icon: 'ri-file-list-2-line',
        LazyComponent: loadable(() =>
          pMinDelay(
            import(/* webpackChunkName: 'AttachmentList' */ '../pages/Attachment/AttachmentList/AttachmentList'),
            LOADABLE_DELAY,
          ),
        ),
        canCreate: true,
        exact: true,
      },
      {
        name: 'Create Attachment',
        namei18n: '_route:createAttachment',
        permission: 'attachment.item-create',
        path: '/attachments/create',
        icon: 'ri-file-list-2-line',
        LazyComponent: loadable(() =>
          pMinDelay(
            import(/* webpackChunkName: 'AttachmentCreate' */ '../pages/Attachment/AttachmentCreate/AttachmentCreate'),
            LOADABLE_DELAY,
          ),
        ),
        exact: true,
        isCreate: true,
      },
    ],
  },
];

if (isDebugMode()) {
  masterRoutes.push(
    //
    // -------- [Debug Group] --------
    //
    {
      name: 'Debug Group',
      namei18n: '_route:debug',
      permission: 'lab.root',
      path: '_debug-group',
      icon: 'ri-code-s-slash-line',
      children: [
        {
          name: 'Test Any',
          namei18n: '_route:testAny',
          permission: ALLOW_PERMISSION,
          path: '/test-any',
          icon: 'ri-code-s-slash-line',
          LazyComponent: loadable(() =>
            pMinDelay(import(/* webpackChunkName: 'TestAny' */ '../pages/Test/TestAny/TestAny'), LOADABLE_DELAY),
          ),
          exact: true,
        },
        {
          name: 'Test Attachment',
          namei18n: '_route:testAttachment',
          permission: ALLOW_PERMISSION,
          path: '/test-attachment',
          icon: 'ri-code-s-slash-line',
          LazyComponent: loadable(() =>
            pMinDelay(
              import(/* webpackChunkName: 'TestAttachment' */ '../pages/Test/TestAttachment/TestAttachment'),
              LOADABLE_DELAY,
            ),
          ),
          exact: true,
        },
        {
          name: 'Test I18n',
          namei18n: '_route:testI18n',
          permission: ALLOW_PERMISSION,
          path: '/test-i18n',
          icon: 'ri-code-s-slash-line',
          LazyComponent: loadable(() =>
            pMinDelay(import(/* webpackChunkName: 'TestI18n' */ '../pages/Test/TestI18n/TestI18n'), LOADABLE_DELAY),
          ),
          exact: true,
        },
      ],
    },
  );
}

const routerDom: ReactNode[] = [];
const parseRoutes = (routeList: IRouteItem[]) => {
  routeList.forEach((item) => {
    if (item.children) {
      parseRoutes(item.children);
    }

    routerDom.push(
      <Route key={item.children ? `group-${item.name}` : item.path} exact={item.exact} path={item.path}>
        <MasterLayout
          route={item}
          component={(matchProps: IPage) => {
            return item.LazyComponent && <item.LazyComponent {...matchProps} fallback={<SuspenseFallback />} />;
          }}
        />
      </Route>,
    );
  });

  return routerDom;
};

const flateRoutes: IRouteItem[] = [];
const parseFlatRoutes = (routeList: IRouteItem[], groupName?: string) => {
  routeList.forEach((item) => {
    const nextItem = _.omit(item, 'LazyComponent');

    if (nextItem.children) parseFlatRoutes(nextItem.children, nextItem.path);

    // loop for children groupName
    if (groupName) nextItem.groupName = groupName;

    flateRoutes.push(nextItem);
  });

  return flateRoutes;
};

export const masterRoute = parseRoutes(masterRoutes);
export const flateMasterRoutes = parseFlatRoutes(masterRoutes);
