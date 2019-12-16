import fetch from 'isomorphic-unfetch';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { OperationDefinitionNode } from 'graphql';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';

import { authUtil, messageUtil } from '@leaa/www/src/utils';
import { envConfig } from '@leaa/www/src/configs';

const isServer = typeof window === 'undefined';

let apolloClientLib: ApolloClient<NormalizedCacheObject>;

if (isServer) {
  // @ts-ignore
  global.fetch = fetch;
}

function createApolloClient(initialState: NormalizedCacheObject, authToken?: string) {
  const httpLink = new HttpLink({
    uri: envConfig.GRAPHQL_ENDPOINT,
    credentials: 'same-origin',
    fetch,
  });

  const authLink = new ApolloLink((operation, forward) => {
    const token = isServer ? authToken : authUtil.getAuthToken();

    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    // @ts-ignore
    return forward(operation);
  });

  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(error => {
        console.error(`❌ [GraphQL error]: ${JSON.stringify(error)}`);

        // messageUtil.gqlError(error.message);
      });
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

  return new ApolloClient({
    link: ApolloLink.from([authLink, errorLink, terminatingLink]),
    cache: new InMemoryCache().restore(initialState || {}),
    connectToDevTools: !isServer,
    ssrMode: isServer,
  });
}

export const apolloClientWithState = (initialState: any = {}, authToken?: string) => {
  if (isServer) {
    return createApolloClient(initialState, authToken);
  }

  if (!apolloClientLib) {
    apolloClientLib = createApolloClient(initialState, authToken);
  }

  return apolloClientLib;
};

export const apolloClient = apolloClientWithState({});
