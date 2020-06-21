import React from 'react';
import { Route } from 'react-router-dom';

import { IRouteItem, IPage } from '@leaa/dashboard/src/interfaces';
import { ALLOW_PERMISSION, LOADABLE_DELAY } from '@leaa/dashboard/src/constants';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';

import { DefaultLayout } from '@leaa/dashboard/src/layouts';
import { Spinner } from '@leaa/dashboard/src/components';

const otherRoutes: IRouteItem[] = [
  {
    name: '*',
    path: '/*',
    permission: ALLOW_PERMISSION,
    LazyComponent: loadable(() =>
      pMinDelay(import(/* webpackChunkName: 'NotFound' */ '../pages/NotFound/NotFound/NotFound'), LOADABLE_DELAY),
    ),
    canCreate: true,
    exact: true,
  },
];

export const otherRoute = otherRoutes.map((item: IRouteItem) => (
  <Route key={item.path} exact path={item.path}>
    <DefaultLayout
      component={(matchProps: IPage) => {
        return item.LazyComponent && <item.LazyComponent {...matchProps} fallback={<Spinner />} />;
      }}
    />
  </Route>
));
