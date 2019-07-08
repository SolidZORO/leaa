import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { authUtil } from '@leaa/dashboard/utils';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = new HttpLink({ uri: process.env.API_HOST });

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

const link = authLink.concat(ApolloLink.from([httpLink]));

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
