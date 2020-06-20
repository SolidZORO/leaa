import React from 'react';
import { Route } from 'react-router-dom';
import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { ALLOW_PERMISSION } from '@leaa/dashboard/src/constants';
import { SuspenseFallback } from '@leaa/dashboard/src/components';
import loadable from '@loadable/component';

const testWithoutLayoutRoutes: IRouteItem[] = [
  {
    name: 'TestAnyWithoutLayout',
    path: '/test-any-without-layout',
    permission: ALLOW_PERMISSION,
    // @ts-ignore
    // prettier-ignore
    // eslint-disable-next-line max-len
    LazyComponent: loadable(() => import(/* webpackChunkName: 'TestAnyWithoutLayout' */ '../pages/TestWithoutLayout/TestAnyWithoutLayout/TestAnyWithoutLayout')),
    canCreate: true,
    exact: true,
  },
];

export const testWithoutLayoutRoute = testWithoutLayoutRoutes.map((item: any) => (
  <Route key={item.path} exact={item.exact} path={item.path}>
    {item.LazyComponent && <item.LazyComponent fallback={<SuspenseFallback />} />}
  </Route>
));
