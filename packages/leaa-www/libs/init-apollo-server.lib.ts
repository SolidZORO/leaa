import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { OperationDefinitionNode } from 'graphql';
import fetch from 'isomorphic-unfetch';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { serverDotenv } from '@leaa/www/server-devenv';

// @ts-ignore
global.fetch = fetch;

export const createApolloClientForServer = (token: string) => {
  const httpLink = new HttpLink({
    uri: serverDotenv.GRAPHQL_ENDPOINT,
    // credentials: 'same-origin',
  });

  const authLink = new ApolloLink((operation, forward) => {
    // prettier-ignore
    // const token = '';

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
    connectToDevTools: false,
    ssrMode: false,
    link,
    cache: new InMemoryCache(),
  });
};
