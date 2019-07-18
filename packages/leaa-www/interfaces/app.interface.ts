import { AppProps } from 'next/app';
import { ApolloClient } from 'apollo-client';

export interface IAppProps extends AppProps {
  apolloClient: ApolloClient<any>;
}
