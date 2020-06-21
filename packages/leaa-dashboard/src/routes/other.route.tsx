import React from 'react';
import { Route } from 'react-router-dom';

import { IRouteItem, IPage } from '@leaa/dashboard/src/interfaces';
import { ALLOW_PERMISSION } from '@leaa/dashboard/src/constants';
import { lazy } from '@loadable/component';

import { BaseLayout } from '@leaa/dashboard/src/layouts';
import { Spinner } from '@leaa/dashboard/src/components';

const otherRoutes: IRouteItem[] = [
  {
    name: 'TestAnyWithoutLayout',
    path: '/test-any-without-layout',
    permission: ALLOW_PERMISSION,
    // @ts-ignore
    // prettier-ignore
    LazyComponent: lazy(() =>
        // eslint-disable-next-line max-len
        import(/* webpackChunkName: 'TestAnyWithoutLayout' */ '../pages/TestWithoutLayout/TestAnyWithoutLayout/TestAnyWithoutLayout'),
    ),
    canCreate: true,
    exact: true,
  },
  {
    name: '*',
    path: '/*',
    permission: ALLOW_PERMISSION,
    LazyComponent: lazy(() => import(/* webpackChunkName: 'NotFound' */ '../pages/NotFound/NotFound/NotFound')),
    canCreate: true,
    exact: true,
  },
];

export const otherRoute = otherRoutes.map((item: IRouteItem) => (
  <Route key={item.path} exact path={item.path}>
    <BaseLayout
      component={(matchProps: IPage) => (
        <React.Suspense fallback={<Spinner />}>
          {item.LazyComponent && <item.LazyComponent {...matchProps} />}
        </React.Suspense>
      )}
    />
  </Route>
));
