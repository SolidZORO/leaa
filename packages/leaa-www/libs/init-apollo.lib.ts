import fetch from 'isomorphic-unfetch';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { OperationDefinitionNode } from 'graphql';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import getConfig from 'next/config';

let apolloClient: ApolloClient<any> | null = null;

if (!process.browser) {
  // @ts-ignore
  global.fetch = fetch;
}

function createApolloClient(initialState: NormalizedCacheObject) {
  const { publicRuntimeConfig } = getConfig();

  const httpLink = new HttpLink({
    uri: publicRuntimeConfig.GRAPHQL_ENDPOINT,
    // credentials: 'same-origin',
  });

  const authLink = new ApolloLink((operation, forward) => {
    // prettier-ignore
    const token = '';

    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    // @ts-ignore
    return forward(operation);
  });

  const terminatingLink = split(
    ({ query: { definitions } }) =>
      definitions.some(node => {
        const { kind } = node as OperationDefinitionNode;
        return kind === 'OperationDefinition';
      }),
    httpLink,
  );

  const link = authLink.concat(ApolloLink.from([terminatingLink]));

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
