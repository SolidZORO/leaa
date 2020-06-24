import React from 'react';
import { Route } from 'react-router-dom';
import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { ALLOW_PERMISSION } from '@leaa/dashboard/src/constants';
import { lazy } from './_lazy';

export const authRouteList: IRouteItem[] = [
  {
    name: 'Login',
    namei18n: '_route:login',
    permission: ALLOW_PERMISSION,
    path: '/login',
    LazyComponent: lazy(() => import(/* webpackChunkName: 'Login' */ '../pages/Auth/Login/Login')),
    // exact: true,
  },
];

export const authRoute = authRouteList.map((route: IRouteItem) => (
  <Route
    {...route}
    key={route.children ? `group-${route.name}` : route?.path}
    // eslint-disable-next-line react/no-children-prop
    children={(props) => <route.LazyComponent {...props} route={route} />}
  />
));
