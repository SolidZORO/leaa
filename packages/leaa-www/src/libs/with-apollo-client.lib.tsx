import React from 'react';
import Head from 'next/head';
import { ApolloClient } from 'apollo-client';
import { renderToString } from 'react-dom/server';
import { AppContext } from 'next/app';
import { getMarkupFromTree, getDataFromTree } from '@apollo/react-ssr';

import { initApollo } from '@leaa/www/src/libs/init-apollo.lib';

const isServer = typeof window === 'undefined';

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

      if (isServer && router && router.route && router.route.includes('/logout')) {
        return Head.rewind();
      }

      if (isServer) {
        try {
          // Run all GraphQL queries
          await getMarkupFromTree({
            renderFunction: renderToString,
            tree: <App {...appProps} Component={Component} router={router} apolloClient={apollo} isServer={isServer} />,
          });

          // await getDataFromTree(
          //   <App {...appProps} Component={Component} router={router} apolloClient={apollo} isServer={isServer} />,
          // );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    }

    apolloClient: any = null;

    constructor(props: any) {
      super(props);

      this.apolloClient = initApollo(props.apolloState);
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} isServer={isServer} />;
    }
  };
};
