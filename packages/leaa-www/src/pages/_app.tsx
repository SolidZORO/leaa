import React, { ErrorInfo } from 'react';
import { Spin } from 'antd';
import App from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import Router from 'next/router';
import { LoadingOutlined } from '@ant-design/icons';

import { IBasePageProps, IGetInitialPropsCtx } from '@leaa/www/src/interfaces';
import { withApolloClient } from '@leaa/www/src/libs/with-apollo-client.lib';
import { initStore, StoreProvider, Store } from '@leaa/www/src/stores';
import { MasterLayout, ProgressLoading } from '@leaa/www/src/components';
import { apolloClient } from '@leaa/www/src/libs';
import { GET_SETTINGS_FOR_WWW } from '@leaa/www/src/graphqls';
import { SettingsWithPaginationObject } from '@leaa/common/src/dtos/setting';

Spin.setDefaultIndicator(<LoadingOutlined spin style={{ fontSize: '180%', marginTop: 30 }} />);

// force refresh style.chunk.css (ONLY for dev mode)
// related discussions @see https://github.com/zeit/next-plugins/issues/282
if (process.env.NODE_ENV !== 'production') {
  const refreshChunkStyle = (chunkFileName: string) => {
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('link');

    style.rel = 'stylesheet';
    style.href = `${chunkFileName}?ts=${new Date().getTime()}`;
    head.append(style);

    const chunks = document.querySelectorAll(`link[href*="${chunkFileName}"]`);

    // delete all chunks css, except the last one. (delay 1s to keep the page from flickering)
    setTimeout(
      () => chunks.forEach((c, i) => i !== chunks.length - 1 && c && c.parentNode && c.parentNode.removeChild(c)),
      1000,
    );
  };

  Router.events.on('routeChangeComplete', () => {
    refreshChunkStyle('/_next/static/css/styles.chunk.css');
  });
}

interface IProps extends IBasePageProps {
  Component: any;
}

interface IState {
  store: Store;
}

class CustomApp extends App<IProps, IState> {
  state = {
    store: new Store({}),
  };

  static async getInitialProps(appContext: IGetInitialPropsCtx | any) {
    const appProps = await App.getInitialProps(appContext);

    // get setting for global
    const getSettingsQuery = await apolloClient.query<{ settings: SettingsWithPaginationObject }>({
      query: GET_SETTINGS_FOR_WWW,
    });

    const storeState = { setting: { globalSettings: getSettingsQuery.data.settings.items } };

    return {
      ...appProps,
      storeState,
    };
  }

  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (state.store.setting.globalSettings.length <= 0) {
      initStore(props.storeState);
    }

    return {
      ...state,
      store: props.storeState,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('CUSTOM-APP ERROR HANDLING', error);

    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    return (
      <ApolloProvider client={this.props.apolloClient}>
        <StoreProvider value={this.props.storeState}>
          <ProgressLoading showAfterMs={100} />

          <MasterLayout {...this.props}>
            <this.props.Component {...this.props} />
          </MasterLayout>
        </StoreProvider>
      </ApolloProvider>
    );
  }
}

export default withApolloClient(CustomApp);
