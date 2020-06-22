import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { MasterLayout } from '@leaa/dashboard/src/layouts';
import Error404 from '@leaa/dashboard/src/pages/Error/404/404';

import { testRoute } from './test.route';
import { authRoute } from './auth.route';

export * from './auth.route';
export * from './master.route';
export * from './test.route';

export const Routes = () => (
  <Router>
    <Switch>
      {authRoute}
      {testRoute}
      <Route exact path="/404" component={Error404} />
      <Route component={MasterLayout} />
    </Switch>
  </Router>
);
