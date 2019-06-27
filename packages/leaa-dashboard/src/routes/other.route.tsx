import React from 'react';
import { DefaultLayout } from '@leaa/dashboard/components/DefaultLayout';
import { RouterLazyLoader } from '@leaa/dashboard/components/RouterLazyLoader';

const otherRouteList: any[] = [
  {
    loader: () => import(/* webpackChunkName: 'NotFound' */ '../pages/NotFound/NotFound'),
  },
];

export const otherRoute = otherRouteList.map(route => (
  <DefaultLayout
    key="notfound"
    component={(matchProps: any) => <RouterLazyLoader loader={route.loader} matchProps={matchProps} />}
  />
));
