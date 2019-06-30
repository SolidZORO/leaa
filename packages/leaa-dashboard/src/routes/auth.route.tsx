import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { AuthLayout } from '@leaa/dashboard/components/AuthLayout';
import { SuspenseFallback } from '@leaa/dashboard/components/SuspenseFallback';
import { IRouteItem } from '@leaa/dashboard/interfaces';

export const authRoutes: IRouteItem[] = [
  {
    name: 'Login',
    path: '/login',
    LazyComponent: React.lazy(() => import(/* webpackChunkName: 'Login' */ '../pages/Auth/Login/Login')),
    exact: true,
  },
];

export const authRoute = authRoutes.map((item: IRouteItem) => (
  <Route key={item.path} exact={item.exact} path={item.path}>
    <AuthLayout
      component={(matchProps: RouteComponentProps) => (
        <React.Suspense fallback={<SuspenseFallback />}>
          {item.LazyComponent && <item.LazyComponent {...matchProps} />}
        </React.Suspense>
      )}
    />
  </Route>
));
