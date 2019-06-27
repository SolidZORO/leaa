import React from 'react';
import { MasterLayout } from '@leaa/dashboard/components/MasterLayout';
import { RouterLazyLoader } from '@leaa/dashboard/components/RouterLazyLoader';

const masterRouteList: any[] = [
  {
    exact: true,
    path: '/',
    loader: () => import(/* webpackChunkName: 'ShowShow' */ '../pages/Playground/ShowShow'),
  },
];

export const masterRoute = masterRouteList.map(route => (
  <MasterLayout
    key={route.path}
    exact={Boolean(route.exact)}
    path={route.path}
    component={(matchProps: any) => <RouterLazyLoader loader={route.loader} matchProps={matchProps} />}
  />
));
