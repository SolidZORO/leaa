import React from 'react';
import { Route } from 'react-router-dom';
import { IRouteItem, IPage } from '@leaa/dashboard/src/interfaces';
import { ALLOW_PERMISSION } from '@leaa/dashboard/src/constants';
import { lazy } from '@loadable/component';

import { Spinner } from '@leaa/dashboard/src/components';
import { AuthLayout } from '@leaa/dashboard/src/layouts';

export const authRoutes: IRouteItem[] = [
  {
    name: 'Login',
    namei18n: '_route:login',
    permission: ALLOW_PERMISSION,
    path: '/login',
    LazyComponent: lazy(() => import(/* webpackChunkName: 'Login' */ '../pages/Auth/Login/Login')),
    exact: true,
  },
];

export const authRoute = authRoutes.map((item: IRouteItem) => (
  <Route key={item.path} exact={item.exact} path={item.path}>
    {item.LazyComponent && (
      <AuthLayout
        route={item}
        lazyComponent={(matchProps: IPage) => (
          <React.Suspense fallback={<Spinner />}>
            <item.LazyComponent {...matchProps} />
          </React.Suspense>
        )}
      />
    )}
  </Route>
));
