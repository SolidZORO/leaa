import React from 'react';
import { LocaleProvider, Tag } from 'antd';
import { Provider } from 'mobx-react';
import zhCN from 'antd/es/locale-provider/zh_CN';

import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';

import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// import { defaultRoute, otherRoute, masterRoute } from '@leaa/dashboard/routes';
// import defaultRoute from '@leaa/dashboard/routes/default.route';
import * as routes from './routes';
import { RootStore } from './stores';
// import { Login } from './pages/Login/Login';
// import { ShowShow } from './pages/Playground/ShowShow';
// import { RouterLazyLoader } from './components/RouterLazyLoader';
// import { MasterLayout } from '@leaa/dashboard/components/MasterLayout';

console.log(process.env);

const httpLink = new HttpLink({
  // uri: process.env.API_HOST,
  uri: 'http://localhost:5555/graphql',
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTYwNzkzODIzLCJleHAiOjE1NzYzNDU4MjN9.msqBKnEKXPMwcWEcWiyxoxk2p3Pfrgp2auZLMztSaZw',
  },
});

const link = ApolloLink.from([httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export const App = () => (
  <ApolloProvider client={client}>
    <LocaleProvider locale={zhCN}>
      <Provider store={RootStore}>
        <Router history={createBrowserHistory()}>
          <Switch>
            {routes.defaultRoute}
            {/*<Route exact path="/" component={Login} />*/}
            {/*<Route exact path="/p" component={ShowShow} />*/}
          </Switch>
        </Router>
      </Provider>
    </LocaleProvider>
  </ApolloProvider>
);
