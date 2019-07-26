import React, { ErrorInfo } from 'react';
import App from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';

import { IAppProps } from '@leaa/www/interfaces';
import { withApolloClient } from '@leaa/www/libs';
import { MasterLayout } from '@leaa/www/components/MasterLayout';
import { ProgressLoading } from '@leaa/www/components/ProgressLoading';
import { appWithTranslation, i18n } from '../i18n';

class CustomApp extends App<IAppProps> {
  // @ts-ignore
  constructor(props) {
    super(props);

    if (i18n.language === undefined) {
      i18n.changeLanguage('zh-CN');
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('CUSTOM ERROR HANDLING', error);
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  // componentDidMount() {
  //   // eslint-disable-next-line global-require
  //   const eruda = require('eruda');
  //   eruda.init();
  // }

  render() {
    return (
      <ApolloProvider client={this.props.apolloClient}>
        <ProgressLoading showAfterMs={200} />

        <MasterLayout {...this.props}>
          <this.props.Component {...this.props} />
        </MasterLayout>
      </ApolloProvider>
    );
  }
}

export default withApolloClient(appWithTranslation(CustomApp));
