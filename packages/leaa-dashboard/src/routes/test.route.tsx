import React from 'react';
import { Route } from 'react-router-dom';
import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { Spinner } from '@leaa/dashboard/src/components';
import { ALLOW_PERMISSION, LOADABLE_DELAY } from '@leaa/dashboard/src/constants';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';

const testWithoutLayoutRoutes: IRouteItem[] = [
  {
    name: 'TestAnyWithoutLayout',
    path: '/test-any-without-layout',
    permission: ALLOW_PERMISSION,
    // @ts-ignore
    // prettier-ignore
    LazyComponent: loadable(() =>
      pMinDelay(
        // eslint-disable-next-line max-len
        import(/* webpackChunkName: 'TestAnyWithoutLayout' */ '../pages/TestWithoutLayout/TestAnyWithoutLayout/TestAnyWithoutLayout'),
        LOADABLE_DELAY,
      ),
    ),
    canCreate: true,
    exact: true,
  },
];

export const testWithoutLayoutRoute = testWithoutLayoutRoutes.map((item: any) => (
  <Route key={item.path} exact={item.exact} path={item.path}>
    {item.LazyComponent && <item.LazyComponent fallback={<Spinner />} />}
  </Route>
));
