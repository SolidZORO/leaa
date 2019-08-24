import fetch from 'isomorphic-unfetch';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { OperationDefinitionNode } from 'graphql';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { envConfig } from '@leaa/www/configs';

let apolloClient: ApolloClient<any> | null = null;

if (!process.browser) {
  // @ts-ignore
  global.fetch = fetch;
}

function createApolloClient(initialState: NormalizedCacheObject) {
  const httpLink = new HttpLink({
    uri: envConfig.GRAPHQL_ENDPOINT,
    // credentials: 'same-origin',
  });

  const authLink = new ApolloLink((operation, forward) => {
    const token = '';

    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    // @ts-ignore
    return forward(operation);
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
      );
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });

  const terminatingLink = split(
    ({ query: { definitions } }) =>
      definitions.some(node => {
        const { kind } = node as OperationDefinitionNode;
        return kind === 'OperationDefinition';
      }),
    httpLink,
  );

  const link = authLink.concat(ApolloLink.from([terminatingLink, errorLink]));

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    link,
    cache: new InMemoryCache().restore(initialState),
  });
}

export const initApollo = (initialState: any = {}) => {
  if (!process.browser) {
    return createApolloClient(initialState);
  }

  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
};
