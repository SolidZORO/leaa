import React from 'react';
import { LocaleProvider, Spin, Icon } from 'antd';
import { createBrowserHistory } from 'history';
import { ApolloProvider } from '@apollo/react-hooks';
import { Router, Switch } from 'react-router-dom';

import { apolloClient } from '@leaa/dashboard/libs';
import { ErrorBoundary } from '@leaa/dashboard/components/ErrorBoundary';

import { masterRoute, authRoute, otherRoute } from './routes';
import { initStore, StoreProvider } from './stores';

const store = initStore();

Spin.setDefaultIndicator(<Icon type="loading" spin />);

export const App = (): JSX.Element => (
  <ErrorBoundary>
    <ApolloProvider client={apolloClient}>
      <LocaleProvider>
        <StoreProvider value={store}>
          <Router history={createBrowserHistory()}>
            <Switch>
              {authRoute}
              {masterRoute}
              {otherRoute}
            </Switch>
          </Router>
        </StoreProvider>
      </LocaleProvider>
    </ApolloProvider>
  </ErrorBoundary>
);
