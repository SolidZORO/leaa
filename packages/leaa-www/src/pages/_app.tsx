import React, { ErrorInfo } from 'react';
import App from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import Router from 'next/router';

import { IPageProps } from '@leaa/www/src/interfaces';
import { withApolloClient } from '@leaa/www/src/libs/with-apollo-client.lib';
import { MasterLayout } from '@leaa/www/src/components/MasterLayout';
import { ProgressLoading } from '@leaa/www/src/components/ProgressLoading';
import { initStore, StoreProvider } from '@leaa/www/src/stores';

const store = initStore();

// force refresh style.chunk.css ONLY for dev mode
if (process.env.NODE_ENV !== 'production') {
  Router.events.on('routeChangeComplete', () => {
    const path = '/_next/static/css/styles.chunk.css';
    const chunksNodes = document.querySelectorAll(`link[href*="${path}"]`);

    if (chunksNodes.length) {
      // @ts-ignore
      // eslint-disable-next-line no-return-assign,no-param-reassign
      chunksNodes.forEach(chunk => (chunk.href = `${path}?force-refresh-ts=${new Date().getTime()}`));
    }
  });
}

class CustomApp extends App<IPageProps> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('CUSTOM ERROR HANDLING', error);

    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    return (
      <ApolloProvider client={this.props.apolloClient}>
        <StoreProvider value={store}>
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
