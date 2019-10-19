import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { authUtil } from '@leaa/dashboard/src/utils';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { OperationDefinitionNode } from 'graphql';

import { envConfig } from '@leaa/dashboard/src/configs';

const httpLink = new HttpLink({
  uri: envConfig.GRAPHQL_ENDPOINT,
  // credentials: 'same-origin',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = authUtil.getAuthToken();

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
    graphQLErrors.forEach(error => console.error(`❌ [GraphQL error]: ${JSON.stringify(error)}`));
  }

  if (networkError) {
    console.error(`❌ [Network error]: ${networkError}`);
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

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, terminatingLink]),
  cache: new InMemoryCache(),
});
