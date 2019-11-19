import React, { useState } from 'react';
import { Spin, Icon, ConfigProvider } from 'antd';
import { ApolloProvider } from '@apollo/react-hooks';
import { Router, Switch } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';

import { apolloClient, history } from '@leaa/dashboard/src/libs';

// cannot use deconstruction components dir in here (App.tsx)
import { ErrorBoundary } from '@leaa/dashboard/src/components/ErrorBoundary';
import { RefreshFlatePermissions } from '@leaa/dashboard/src/components/RefreshFlatePermissions';

import { masterRoute, authRoute, otherRoute } from '@leaa/dashboard/src/routes';
import { initStore, StoreProvider } from '@leaa/dashboard/src/stores';
import i18n from '@leaa/dashboard/src/i18n';

const store = initStore();

Spin.setDefaultIndicator(<Icon type="loading" spin style={{ fontSize: '150%' }} />);

export const App = (): JSX.Element => {
  const getLocale = () => (i18n.language === 'zh-CN' ? zhCN : enUS);
  const [locale, setLocale] = useState(getLocale());

  i18n.on('languageChanged', () => {
    setLocale(getLocale());
  });

  return (
    <ErrorBoundary>
      <ConfigProvider locale={locale}>
        <ApolloProvider client={apolloClient}>
          <StoreProvider value={store}>
            <I18nextProvider i18n={i18n}>
              <RefreshFlatePermissions history={history}>
                <Router history={history}>
                  <Switch>
                    {authRoute}
                    {masterRoute}
                    {otherRoute}
                  </Switch>
                </Router>
              </RefreshFlatePermissions>
            </I18nextProvider>
          </StoreProvider>
        </ApolloProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};
