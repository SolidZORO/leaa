import React from 'react';
import { Route } from 'react-router-dom';
import { IRouteItem, IPage } from '@leaa/dashboard/src/interfaces';
import { ALLOW_PERMISSION } from '@leaa/dashboard/src/constants';
import loadable from '@loadable/component';

import { AuthLayout, SuspenseFallback } from '@leaa/dashboard/src/components';

export const authRoutes: IRouteItem[] = [
  {
    name: 'Login',
    namei18n: '_route:login',
    permission: ALLOW_PERMISSION,
    path: '/login',
    LazyComponent: loadable(() => import(/* webpackChunkName: 'Login' */ '../pages/Auth/Login/Login')),
    exact: true,
  },
];

export const authRoute = authRoutes.map((item: IRouteItem) => (
  <Route key={item.path} exact={item.exact} path={item.path}>
    <AuthLayout
      route={item}
      component={(matchProps: IPage) => {
        return item.LazyComponent && <item.LazyComponent {...matchProps} fallback={<SuspenseFallback />} />;
      }}
    />
  </Route>
));
