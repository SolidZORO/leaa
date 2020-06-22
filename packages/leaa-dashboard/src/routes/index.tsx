import React from 'react';
import { history } from '@leaa/dashboard/src/libs';
import { Switch, Route, Router } from 'react-router-dom';
import { MasterLayout } from '@leaa/dashboard/src/layouts';

export * from './auth.route';
export * from './master.route';
export * from './other.route';

export const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route component={MasterLayout} />
    </Switch>
  </Router>
);
