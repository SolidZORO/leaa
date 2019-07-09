import React from 'react';
import { Route } from 'react-router-dom';

import { IRouteItem, IPage } from '@leaa/dashboard/interfaces';
import { ALLOW_PERMISSION } from '@leaa/dashboard/constants';
import { SuspenseFallback } from '@leaa/dashboard/components/SuspenseFallback';
import { DefaultLayout } from '@leaa/dashboard/components/DefaultLayout';

const otherRoutes: IRouteItem[] = [
  {
    name: '*',
    path: '/*',
    permission: ALLOW_PERMISSION,
    LazyComponent: React.lazy(() => import(/* webpackChunkName: 'NotFound' */ '../pages/NotFound/NotFound/NotFound')),
    canCreate: true,
    exact: true,
  },
];

export const otherRoute = otherRoutes.map((item: IRouteItem) => (
  <Route key={item.path} exact path={item.path}>
    <DefaultLayout
      component={(matchProps: IPage) => (
        <React.Suspense fallback={<SuspenseFallback />}>
          {item.LazyComponent && <item.LazyComponent {...matchProps} />}
        </React.Suspense>
      )}
    />
  </Route>
));
