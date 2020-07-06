import _ from 'lodash';
import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RiBookLine, RiFlagLine, RiSettingsLine, RiGroupLine, RiStackLine, RiCodeSSlashLine } from 'react-icons/ri';

import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { ALLOW_PERMISSION } from '@leaa/dashboard/src/constants';
import { isDebugMode } from '@leaa/dashboard/src/utils/debug.util';
import { lazy } from './_lazy';

// TIPS: permission: 'ALLOW_PERMISSION' will be always display

export const UUID_REGX = '[\\w]{8}-[\\w]{4}-[\\w]{4}-[\\w]{4}-[\\w]{12}';

export const masterRouteList: IRouteItem[] = [
  // ---- Home ----
  //
  {
    name: 'Home',
    namei18n: '_route:home',
    permission: ALLOW_PERMISSION,
    path: '/',
    LazyComponent: lazy(() => import(/* webpackChunkName: 'Home' */ '../pages/Home/Home/Home')),
    exact: true,
  },
  //
  // -------- [Content Group] --------
  //
  {
    name: 'Content Group',
    namei18n: '_route:contentGroup',
    permission: 'article.list-read | tag.list-read',
    path: '_content-group',
    icon: <RiBookLine />,
    children: [
      // ---- Article ----
      {
        name: 'Create Article',
        namei18n: '_route:createArticle',
        permission: 'article.item-create',
        path: '/articles/create',
        LazyComponent: lazy(() =>
          import(/* webpackChunkName: 'ArticleCreate' */ '../pages/Article/ArticleCreate/ArticleCreate'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Article',
        namei18n: '_route:editArticle',
        permission: 'article.item-read',
        path: `/articles/:id(${UUID_REGX})`,
        LazyComponent: lazy(() =>
          import(/* webpackChunkName: 'ArticleEdit' */ '../pages/Article/ArticleEdit/ArticleEdit'),
        ),
        exact: true,
      },
      {
        name: 'Article',
        namei18n: '_route:article',
        permission: 'article.list-read',
        path: '/articles',
        LazyComponent: lazy(() =>
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
        LazyComponent: lazy(() => import(/* webpackChunkName: 'TagCreate' */ '../pages/Tag/TagCreate/TagCreate')),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Tag',
        namei18n: '_route:editTag',
        permission: 'tag.item-read',
        path: `/tags/:id(${UUID_REGX})`,
        LazyComponent: lazy(() => import(/* webpackChunkName: 'TagEdit' */ '../pages/Tag/TagEdit/TagEdit')),
        exact: true,
      },
      {
        name: 'Tag',
        namei18n: '_route:tag',
        permission: 'tag.list-read',
        path: '/tags',
        LazyComponent: lazy(() => import(/* webpackChunkName: 'TagList' */ '../pages/Tag/TagList/TagList')),
        canCreate: true,
        exact: true,
      },
      //
      // ---- Category ----
      //
      {
        name: 'Create Category',
        namei18n: '_route:createCategory',
        permission: 'category.item-create',
        path: '/categories/create',
        LazyComponent: lazy(() =>
          import(/* webpackChunkName: 'CategoryCreate' */ '../pages/Category/CategoryCreate/CategoryCreate'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Category',
        namei18n: '_route:editCategory',
        permission: 'category.item-read',
        path: `/categories/:id(${UUID_REGX})`,
        LazyComponent: lazy(() =>
          import(/* webpackChunkName: 'CategoryEdit' */ '../pages/Category/CategoryEdit/CategoryEdit'),
        ),
        exact: true,
      },
      {
        name: 'Category',
        namei18n: '_route:category',
        permission: 'category.list-read',
        path: '/categories',
        LazyComponent: lazy(() =>
          import(/* webpackChunkName: 'CategoryList' */ '../pages/Category/CategoryList/CategoryList'),
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
    icon: <RiFlagLine />,
    children: [
      // ---- Ax ----
      {
        name: 'Create Ax',
        namei18n: '_route:createAx',
        permission: 'ax.item-create',
        path: '/axs/create',
        LazyComponent: lazy(() => import(/* webpackChunkName: 'AxCreate' */ '../pages/Ax/AxCreate/AxCreate')),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Ax',
        namei18n: '_route:editAx',
        permission: 'ax.item-read',
        path: `/axs/:id(${UUID_REGX})`,
        LazyComponent: lazy(() => import(/* webpackChunkName: 'AxEdit' */ '../pages/Ax/AxEdit/AxEdit')),
        exact: true,
      },
      {
        name: 'Ax',
        namei18n: '_route:ax',
        permission: 'ax.list-read',
        path: '/axs',
        LazyComponent: lazy(() => import(/* webpackChunkName: 'AxList' */ '../pages/Ax/AxList/AxList')),
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
    icon: <RiGroupLine />,
    children: [
      // ---- User ----
      {
        name: 'Create User',
        namei18n: '_route:createUser',
        permission: 'user.item-create',
        path: '/users/create',
        LazyComponent: lazy(() => import(/* webpackChunkName: 'UserCreate' */ '../pages/User/UserCreate/UserCreate')),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit User',
        namei18n: '_route:editUser',
        permission: 'user.item-read',
        path: `/users/:id(${UUID_REGX})`,
        LazyComponent: lazy(() => import(/* webpackChunkName: 'UserEdit' */ '../pages/User/UserEdit/UserEdit')),
        exact: true,
      },
      {
        name: 'User',
        namei18n: '_route:user',
        permission: 'user.list-read',
        path: '/users',
        LazyComponent: lazy(() => import(/* webpackChunkName: 'UserList' */ '../pages/User/UserList/UserList')),
        canCreate: true,
        exact: true,
      },
      // ---- Role ----
      {
        name: 'Create Role',
        namei18n: '_route:createRole',
        permission: 'role.item-create',
        path: '/roles/create',
        LazyComponent: lazy(() => import(/* webpackChunkName: 'RoleCreate' */ '../pages/Role/RoleCreate/RoleCreate')),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Role',
        namei18n: '_route:editRole',
        permission: 'role.item-read',
        path: `/roles/:id(${UUID_REGX})`,
        LazyComponent: lazy(() => import(/* webpackChunkName: 'RoleEdit' */ '../pages/Role/RoleEdit/RoleEdit')),
        exact: true,
      },
      {
        name: 'Role',
        namei18n: '_route:role',
        permission: 'role.list-read',
        path: '/roles',
        LazyComponent: lazy(() => import(/* webpackChunkName: 'RoleList' */ '../pages/Role/RoleList/RoleList')),
        canCreate: true,
        exact: true,
      },
      // ---- Permission ----
      {
        name: 'Create Permission',
        namei18n: '_route:createPermission',
        permission: 'permission.item-create',
        path: '/permissions/create',
        LazyComponent: lazy(() =>
          import(/* webpackChunkName: 'PermissionCreate' */ '../pages/Permission/PermissionCreate/PermissionCreate'),
        ),
        exact: true,
        isCreate: true,
      },
      {
        name: 'Edit Permission',
        namei18n: '_route:editPermission',
        permission: 'permission.item-read',
        path: `/permissions/:id(${UUID_REGX})`,
        LazyComponent: lazy(() =>
          import(/* webpackChunkName: 'PermissionEdit' */ '../pages/Permission/PermissionEdit/PermissionEdit'),
        ),
        exact: true,
      },
      {
        name: 'Permission',
        namei18n: '_route:permission',
        permission: 'permission.list-read',
        path: '/permissions',
        LazyComponent: lazy(() =>
          import(/* webpackChunkName: 'PermissionList' */ '../pages/Permission/PermissionList/PermissionList'),
        ),
        canCreate: true,
        exact: true,
      },
    ],
  },

  //
  // -------- [Data Group] --------
  //
  {
    name: 'Data Group',
    namei18n: '_route:dataGroup',
    permission: 'address.list-read',
    path: '_data-group',
    icon: <RiStackLine />,
    children: [
      // ---- Oauth ----
      {
        name: 'Oauth',
        namei18n: '_route:oauth',
        permission: 'oauth.list-read',
        path: '/oauths',
        LazyComponent: lazy(() => import(/* webpackChunkName: 'OauthList' */ '../pages/Oauth/OauthList/OauthList')),
        canCreate: false,
        exact: true,
      },
      // ---- Action ----
      {
        name: 'Action',
        namei18n: '_route:action',
        permission: 'action.list-read',
        path: '/actions',
        LazyComponent: lazy(() => import(/* webpackChunkName: 'ActionList' */ '../pages/Action/ActionList/ActionList')),
        // canCreate: true,
        exact: true,
      },
      {
        name: 'Edit Action',
        namei18n: '_route:editAction',
        permission: 'action.item-read',
        path: '/actions/:id(\\d+)',
        LazyComponent: lazy(() => import(/* webpackChunkName: 'ActionEdit' */ '../pages/Action/ActionEdit/ActionEdit')),
        exact: true,
      },
      // ---- Attachment ----
      {
        name: 'Attachment',
        namei18n: '_route:attachment',
        permission: 'attachment.list-read',
        path: '/attachments',
        LazyComponent: lazy(() =>
          import(/* webpackChunkName: 'AttachmentList' */ '../pages/Attachment/AttachmentList/AttachmentList'),
        ),
        canCreate: true,
        exact: true,
      },
      {
        name: 'Create Attachment',
        namei18n: '_route:createAttachment',
        permission: 'attachment.item-create',
        path: '/attachments/create',
        LazyComponent: lazy(() =>
          import(/* webpackChunkName: 'AttachmentCreate' */ '../pages/Attachment/AttachmentCreate/AttachmentCreate'),
        ),
        exact: true,
        isCreate: true,
      },
    ],
  },
  //
  // ---- Setting ----
  //
  {
    name: 'Setting',
    namei18n: '_route:setting',
    permission: 'setting.list-read',
    path: '/settings',
    icon: <RiSettingsLine />,
    LazyComponent: lazy(() => import(/* webpackChunkName: 'SettingList' */ '../pages/Setting/SettingList/SettingList')),
    exact: true,
  },
];

if (isDebugMode()) {
  masterRouteList.push(
    //
    // -------- [Debug Group] --------
    //
    {
      name: 'Debug Group',
      namei18n: '_route:debug',
      permission: 'lab.root',
      path: '_debug-group',
      icon: <RiCodeSSlashLine />,
      children: [
        {
          name: 'Test Any',
          namei18n: '_route:testAny',
          permission: ALLOW_PERMISSION,
          path: '/test-any',
          LazyComponent: lazy(() => import(/* webpackChunkName: 'TestAny' */ '../pages/Test/TestAny/TestAny')),
          exact: true,
        },
        {
          name: 'Test Attachment',
          namei18n: '_route:testAttachment',
          permission: ALLOW_PERMISSION,
          path: '/test-attachment',
          LazyComponent: lazy(() =>
            import(/* webpackChunkName: 'TestAttachment' */ '../pages/Test/TestAttachment/TestAttachment'),
          ),
          exact: true,
        },
        {
          name: 'Test I18n',
          namei18n: '_route:testI18n',
          permission: ALLOW_PERMISSION,
          path: '/test-i18n',
          LazyComponent: lazy(() => import(/* webpackChunkName: 'TestI18n' */ '../pages/Test/TestI18n/TestI18n')),
          exact: true,
        },
      ],
    },
  );
}

const routerDom: ReactNode[] = [];
const parseRoutes = (routeList: IRouteItem[]) => {
  routeList.forEach((route) => {
    if (route.children) {
      parseRoutes(route.children);
    }

    routerDom.push(
      <Route
        {...route}
        key={route.children ? `group-${route.name}` : route?.path}
        // eslint-disable-next-line react/no-children-prop
        children={(props) => <route.LazyComponent {...props} route={route} />}
      />,
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

export const masterRoute = parseRoutes(masterRouteList);
export const flateMasterRoutes: IRouteItem[] = parseFlatRoutes(masterRouteList);
