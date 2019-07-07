import React, { useState } from 'react';
import { Spin, Icon, LocaleProvider } from 'antd';
import { createBrowserHistory } from 'history';
import { I18nextProvider } from 'react-i18next';
import { ApolloProvider } from '@apollo/react-hooks';
import { Router, Switch } from 'react-router-dom';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';

import { apolloClient } from '@leaa/dashboard/libs';
import { ErrorBoundary } from '@leaa/dashboard/components/ErrorBoundary';

import i18n from './i18n';
import { masterRoute, authRoute, otherRoute } from './routes';
import { initStore, StoreProvider } from './stores';

const store = initStore();

Spin.setDefaultIndicator(<Icon type="loading" spin />);

export const App = (): JSX.Element => {
  // const [lang, setLang] = useState(i18n.language === 'cn' ? zhCN : enUS);
  //
  // i18n.on('languageChanged', e => {
  //   if (e === 'cn') {
  //     setLang(zhCN);
  //   }
  //   if (e === 'en') {
  //     setLang(enUS);
  //   }
  // });

  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <ApolloProvider client={apolloClient}>
          <StoreProvider value={store}>
            <Router history={createBrowserHistory()}>
              <Switch>
                {authRoute}
                {masterRoute}
                {otherRoute}
              </Switch>
            </Router>
          </StoreProvider>
        </ApolloProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
};
