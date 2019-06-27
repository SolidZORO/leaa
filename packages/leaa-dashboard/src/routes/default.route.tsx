import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { RouterLazyLoader } from '@leaa/dashboard/components/RouterLazyLoader';
import { MasterLayout } from '@leaa/dashboard/components/MasterLayout';

interface LoadableRoute {
  path: string;
  LazyComponent: React.LazyExoticComponent<any>;
}

const routes: LoadableRoute[] = [
  {
    path: '/',
    LazyComponent: React.lazy(() => import(/* webpackChunkName: 'Home' */ '../pages/Login/Login/Login')),
  },
];

const defaultRoute = (
  <Switch>
    {routes.map(({ path, LazyComponent }: LoadableRoute) => (
      <Route key={path} exact path={path}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <MasterLayout component={<LazyComponent />} />
        </React.Suspense>
      </Route>
    ))}
    {/* {LC3Routes} */}
    <Route path="/*" component={(): JSX.Element => <p>NO FOUND...</p>} />
  </Switch>
);

export default defaultRoute;
