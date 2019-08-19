import Taro from '@tarojs/taro';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, split } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import wxApolloFetcher from 'wx-apollo-fetcher';

import { envConfig } from '@leaa/miniprogram/src/configs';

const apolloFetch = Taro.getEnv() === 'WEAPP' ? { fetch: wxApolloFetcher } : {};

const httpLink = new HttpLink({ uri: envConfig.GRAPHQL_ENDPOINT, ...apolloFetch });

const authLink = new ApolloLink((operation, forward) => {
  const token = null;

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
      const { kind } = node;
      return kind === 'OperationDefinition';
    }),
  httpLink,
);

const link = authLink.concat(ApolloLink.from([terminatingLink]));

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
