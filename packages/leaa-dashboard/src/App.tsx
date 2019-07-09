import React, { useState } from 'react';
import { Spin, Icon, LocaleProvider } from 'antd';
import { ApolloProvider } from '@apollo/react-hooks';
import { Router, Switch } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';

import { apolloClient } from '@leaa/dashboard/libs';
import { ErrorBoundary } from '@leaa/dashboard/components/ErrorBoundary';
import { RefreshFlatePermissions } from '@leaa/dashboard/components/RefreshFlatePermissions';

import { history } from './libs';
import { masterRoute, authRoute, otherRoute } from './routes';
import { initStore, StoreProvider } from './stores';
import i18n from './i18n';

const store = initStore();

Spin.setDefaultIndicator(<Icon type="loading" spin />);

export const App = (): JSX.Element => {
  const getLocale = () => (i18n.language === 'zh-CN' ? zhCN : enUS);
  const [locale, setLocale] = useState(getLocale());

  i18n.on('languageChanged', () => {
    setLocale(getLocale());
  });

  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <ApolloProvider client={apolloClient}>
          <StoreProvider value={store}>
            <LocaleProvider locale={locale}>
              <RefreshFlatePermissions>
                <Router history={history}>
                  <Switch>
                    {authRoute}
                    {masterRoute}
                    {otherRoute}
                  </Switch>
                </Router>
              </RefreshFlatePermissions>
            </LocaleProvider>
          </StoreProvider>
        </ApolloProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
};
