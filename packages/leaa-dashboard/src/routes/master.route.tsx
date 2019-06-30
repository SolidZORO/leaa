import React, { ReactNode } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { IRouteItem } from '@leaa/dashboard/interfaces';
import { MasterLayout } from '@leaa/dashboard/components/MasterLayout';
import { SuspenseFallback } from '@leaa/dashboard/components/SuspenseFallback';

export const masterRoutes: IRouteItem[] = [
  {
    name: 'Userxxxxxxxxxxxxxx',
    path: '__group-user',
    icon: 'user',
    children: [
      {
        name: 'Show Item222',
        path: '/show22/:id(\\d+)',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'ShowItem' */ '../pages/Playground/ShowShow/ShowShow'),
        ),
        hasParam: true,
        exact: true,
      },
      {
        name: 'Show All3333',
        path: '/show22',
        icon: 'setting',
        LazyComponent: React.lazy(() =>
          import(/* webpackChunkName: 'ShowShow' */ '../pages/Playground/ShowShow/ShowShow'),
        ),
        canCreate: true,
        exact: true,
      },
    ],
  },
  {
    name: 'UserPermissions',
    path: '/user-permissions',
    icon: 'user',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'UserPermissions' */ '../pages/Playground/ShowUserPermissions/ShowUserPermissions'),
    ),
    exact: true,
  },
  {
    name: 'UserPermissions111',
    path: '/user-permissions/:id(\\d+)',
    icon: 'user',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'UserPermissions22' */ '../pages/Playground/ShowUserPermissions/ShowUserPermissions'),
    ),
    exact: true,
    hasParam: true,
  },
  {
    name: 'Show Create',
    path: '/show/create',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'ShowCreate' */ '../pages/Playground/ShowShow/ShowShow'),
    ),
    isCreate: true,
    hasParam: true,
    exact: true,
  },
  {
    name: 'Show Item',
    path: '/show/:id(\\d+)',
    LazyComponent: React.lazy(() => import(/* webpackChunkName: 'ShowItem' */ '../pages/Playground/ShowShow/ShowShow')),
    hasParam: true,
    exact: true,
  },
  {
    name: 'Show All',
    path: '/show',
    icon: 'setting',
    LazyComponent: React.lazy(() => import(/* webpackChunkName: 'ShowShow' */ '../pages/Playground/ShowShow/ShowShow')),
    canCreate: true,
    exact: true,
  },
  {
    name: 'Show Item',
    path: '/',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'ShowItemxx' */ '../pages/Playground/ShowShow/ShowShow'),
    ),
    hasParam: true,
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
          component={(matchProps: RouteComponentProps) => (
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

export const masterRoute = parseRoutes(masterRoutes);
