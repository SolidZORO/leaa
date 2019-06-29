import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = new HttpLink({
  uri: process.env.API_HOST,
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTYwNzkzODIzLCJleHAiOjE1NzYzNDU4MjN9.msqBKnEKXPMwcWEcWiyxoxk2p3Pfrgp2auZLMztSaZw',
  },
});

console.log(process.env.API_HOST);

const link = ApolloLink.from([httpLink]);

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
