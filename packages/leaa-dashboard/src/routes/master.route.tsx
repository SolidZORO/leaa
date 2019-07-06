import _ from 'lodash';
import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';

import { IRouteItem, IPage } from '@leaa/dashboard/interfaces';
import { MasterLayout } from '@leaa/dashboard/components/MasterLayout';
import { SuspenseFallback } from '@leaa/dashboard/components/SuspenseFallback';

export const masterRoutes: IRouteItem[] = [
  {
    name: 'Folder',
    path: '_group',
    icon: 'folder',
    children: [
      {
        name: 'Create Show',
        path: '/show/create',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'CreateShow' */ '../pages/Playground/ShowShow/ShowShow'),
        ),
        isCreate: true,
        exact: true,
      },
      {
        name: 'Show',
        path: '/show/:id(\\d+)',
        LazyComponent: React.lazy(() => import(/* webpackChunkName: 'Show' */ '../pages/Playground/ShowShow/ShowShow')),
        exact: true,
      },
      {
        name: 'Shows',
        path: '/show',
        icon: 'setting',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'Shows' */ '../pages/Playground/ShowShow/ShowShow'),
        ),
        canCreate: true,
        exact: true,
      },
    ],
  },
  {
    name: 'User Create',
    path: '/users/create',
    icon: 'user',
    LazyComponent: React.lazy(() => import(/* webpackChunkName: 'UserCreate' */ '../pages/User/UserCreate/UserCreate')),
    exact: true,
    isCreate: true,
  },
  {
    name: 'User Edit',
    path: '/users/:id(\\d+)',
    icon: 'user',
    LazyComponent: React.lazy(() => import(/* webpackChunkName: 'UserEdit' */ '../pages/User/UserEdit/UserEdit')),
    exact: true,
  },
  {
    name: 'User',
    path: '/users',
    icon: 'user',
    LazyComponent: React.lazy(() => import(/* webpackChunkName: 'UserList' */ '../pages/User/UserList/UserList')),
    canCreate: true,
    exact: true,
  },
  {
    name: 'Permissions',
    path: '/user-permissions',
    icon: 'flag',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'Permissions' */ '../pages/Playground/ShowUserPermissions/ShowUserPermissions'),
    ),
    exact: true,
  },
  {
    name: 'Permission',
    path: '/user-permissions/:id(\\d+)',
    icon: 'user',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'Permission' */ '../pages/Playground/ShowUserPermissions/ShowUserPermissions'),
    ),
    exact: true,
  },
  {
    name: 'HOME',
    path: '/',
    LazyComponent: React.lazy(() => import(/* webpackChunkName: 'Home' */ '../pages/Playground/ShowShow/ShowShow')),
    exact: true,
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
