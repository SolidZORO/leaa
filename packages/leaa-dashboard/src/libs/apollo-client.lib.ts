import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';

const httpLink = new HttpLink({
  uri: process.env.API_HOST,
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTYwNzkzODIzLCJleHAiOjE1NzYzNDU4MjN9.msqBKnEKXPMwcWEcWiyxoxk2p3Pfrgp2auZLMztSaZw',
  },
});

const linkError = onError(({ graphQLErrors, networkError, operation, response }) => {
  if (response && operation.operationName === 'IgnoreErrorsQuery') {
    response.errors = undefined;
  }

  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      const t = `[GraphQL errxxxxor]: Message: ${message}, Location: ${locations}, Path: ${path}`;
      console.log(t);

      return t;
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = ApolloLink.from([linkError, httpLink]);

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
