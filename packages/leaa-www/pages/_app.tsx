import React, { ErrorInfo } from 'react';
import App, { Container } from 'next/app';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { withApolloClient } from '@leaa/www/libs';

class Layout extends React.Component {
  render() {
    const { children } = this.props;
    return <div className="layout">{children}</div>;
  }
}

class CustomApp extends App<{ apolloClient: ApolloClient<any> }> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('CUSTOM ERROR HANDLING', error);
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <ApolloProvider client={apolloClient}>
        <Container>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Container>
      </ApolloProvider>
    );
  }
}

export default withApolloClient(CustomApp);
