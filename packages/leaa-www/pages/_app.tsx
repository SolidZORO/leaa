import React, { ErrorInfo } from 'react';
import App from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';

import { IAppProps } from '@leaa/www/interfaces';
import { withApolloClient } from '@leaa/www/libs';
import { MasterLayout } from '@leaa/www/components/MasterLayout';
import { ProgressLoading } from '@leaa/www/components/ProgressLoading';

class CustomApp extends App<IAppProps> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('CUSTOM ERROR HANDLING', error);
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  componentDidMount() {
    const eruda = require('eruda');
    eruda.init();
  }

  render() {
    return (
      <ApolloProvider client={this.props.apolloClient}>
        <ProgressLoading showAfterMs={800} />

        <MasterLayout {...this.props}>
          <this.props.Component {...this.props} />
        </MasterLayout>
      </ApolloProvider>
    );
  }
}

export default withApolloClient(CustomApp);
