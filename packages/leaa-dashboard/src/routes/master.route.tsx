import _ from 'lodash';
import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { MasterLayout } from '@leaa/dashboard/components/MasterLayout';
import { SuspenseFallback } from '@leaa/dashboard/components/SuspenseFallback';
import { IRouteItem, IRouteMenu } from '@leaa/dashboard/interfaces';

export const routes: IRouteItem[] = [
  {
    name: 'UserPermissions',
    path: '/show/user-permissions',
    icon: 'user',
    LazyComponent: React.lazy(() =>
      import(/* webpackChunkName: 'ShowCreate' */ '../pages/Playground/ShowUserPermissions/ShowUserPermissions'),
    ),
    exact: true,
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

export const masterRouteMenus: IRouteMenu[] = routes.map(r => _.omit(r, 'LazyComponent'));

export const masterRoute = routes.map(({ path, LazyComponent, exact }: IRouteItem) => (
  <Route key={path} exact={exact} path={path}>
    <MasterLayout
      component={(matchProps: RouteComponentProps) => (
        <React.Suspense fallback={<SuspenseFallback />}>
          <LazyComponent {...matchProps} />
        </React.Suspense>
      )}
    />
  </Route>
));
