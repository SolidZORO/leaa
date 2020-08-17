import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { Spin, ConfigProvider } from 'antd';
import { I18nextProvider } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import { LoadingOutlined } from '@ant-design/icons';
import zhCN from 'antd/es/locale-provider/zh_CN';
import enUS from 'antd/es/locale-provider/en_US';
// cannot use deconstruction components dir in here (App.tsx)
import { ErrorBoundary } from '@leaa/dashboard/src/components/ErrorBoundary/ErrorBoundary';
import { RefreshflatPermissions } from '@leaa/dashboard/src/components/RefreshflatPermissions/RefreshflatPermissions';
import { RefreshSetting } from '@leaa/dashboard/src/components/RefreshSetting/RefreshSetting';

import i18n from '@leaa/dashboard/src/i18n';
import { Routes } from '@leaa/dashboard/src/routes';
import { envConfig } from '@leaa/dashboard/src/configs';
import { initStore, StoreProvider } from '@leaa/dashboard/src/stores';

const store = initStore();

Spin.setDefaultIndicator(<LoadingOutlined spin style={{ fontSize: '180%', marginTop: 30 }} />);

export const App = (): JSX.Element => {
  const getLocale = () => (i18n.language === 'zh-CN' ? zhCN : enUS);
  const [locale, setLocale] = useState(getLocale());

  i18n.on('languageChanged', () => {
    setLocale(getLocale());
  });

  const NOT_FOUND_CONFIG_DOM = <p>PLEASE CHECK ENV CONFIG FILE!</p>;

  if (!envConfig) return NOT_FOUND_CONFIG_DOM;

  // return <p>for DEBUG</p>;

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ConfigProvider locale={locale}>
          <StoreProvider value={store}>
            <I18nextProvider i18n={i18n}>
              <IconContext.Provider value={{ className: 'rcicon' }}>
                <RefreshSetting>
                  <RefreshflatPermissions>
                    <Routes />
                  </RefreshflatPermissions>
                </RefreshSetting>
              </IconContext.Provider>
            </I18nextProvider>
          </StoreProvider>
        </ConfigProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};
