import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { IRouteItem } from '@leaa/dashboard/interfaces';
import { SuspenseFallback } from '@leaa/dashboard/components/SuspenseFallback';
import { DefaultLayout } from '@leaa/dashboard/components/DefaultLayout';

const routes: IRouteItem[] = [
  {
    name: '*',
    path: '/*',
    LazyComponent: React.lazy(() => import(/* webpackChunkName: 'NotFound' */ '../pages/NotFound/NotFound/NotFound')),
    canCreate: true,
    exact: true,
  },
];

export const otherRoute = routes.map(({ path, LazyComponent }: IRouteItem) => (
  <Route key={path} exact path={path}>
    <DefaultLayout
      component={(matchProps: RouteComponentProps) => (
        <React.Suspense fallback={<SuspenseFallback />}>
          <LazyComponent {...matchProps} />
        </React.Suspense>
      )}
    />
  </Route>
));
