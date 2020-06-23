import React from 'react';
import { Route } from 'react-router-dom';

import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { ALLOW_PERMISSION } from '@leaa/dashboard/src/constants';
import { lazy } from './lazy';

const testRouteList: IRouteItem[] = [
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
  // {
  //   name: '*',
  //   path: '/*',
  //   permission: ALLOW_PERMISSION,
  //   LazyComponent: lazy(() => import(/* webpackChunkName: 'NotFound' */ '../pages/NotFound/NotFound/NotFound')),
  //   canCreate: true,
  //   exact: true,
  // },
];

export const testRoute = testRouteList.map((route: IRouteItem) => (
  <Route
    {...route}
    key={route.path}
    // eslint-disable-next-line react/no-children-prop
    children={(props) => <route.LazyComponent {...props} route={route} />}
  />
));
