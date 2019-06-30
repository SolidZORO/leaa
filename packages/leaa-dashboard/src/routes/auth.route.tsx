import _ from 'lodash';
import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { AuthLayout } from '@leaa/dashboard/components/AuthLayout';
import { SuspenseFallback } from '@leaa/dashboard/components/SuspenseFallback';
import { IRouteItem, IRouteMenu } from '@leaa/dashboard/interfaces';

export const routes: IRouteItem[] = [
  {
    name: 'Login',
    path: '/login',
    LazyComponent: React.lazy(() => import(/* webpackChunkName: 'Login' */ '../pages/Auth/Login/Login')),
    exact: true,
  },
];

export const authRouteMenus: IRouteMenu[] = routes.map(r => _.omit(r, 'LazyComponent'));

export const authRoute = routes.map(({ path, LazyComponent, exact }: IRouteItem) => (
  <Route key={path} exact={exact} path={path}>
    <AuthLayout
      component={(matchProps: RouteComponentProps) => (
        <React.Suspense fallback={<SuspenseFallback />}>
          <LazyComponent {...matchProps} />
        </React.Suspense>
      )}
    />
  </Route>
));
