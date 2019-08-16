import React from 'react';
import Head from 'next/head';
import { ApolloClient } from 'apollo-client';
import { renderToString } from 'react-dom/server';
import { AppContext } from 'next/app';
import { getMarkupFromTree } from '@apollo/react-ssr';

import { initApollo } from '@leaa/www/libs/init-apollo-client.lib';

export const withApolloClient = (App: React.ComponentType<any> & { getInitialProps?: Function }) => {
  return class Apollo extends React.Component {
    // eslint-disable-next-line react/static-property-placement
    static displayName = 'withApollo(App)';

    static async getInitialProps(ctx: AppContext) {
      const { Component, router } = ctx;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      // Run all GraphQL queries in the component tree and extract the resulting data
      const apollo = initApollo();

      if (!process.browser) {
        try {
          await getMarkupFromTree({
            renderFunction: renderToString,
            tree: <App {...appProps} Component={Component} router={router} apolloClient={apollo} />,
          });
        } catch (error) {
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error);
        }

        Head.rewind();
      }

      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    }

    apolloClient: ApolloClient<any>;

    constructor(props: any) {
      super(props);

      this.apolloClient = initApollo(props.apolloState);
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};
