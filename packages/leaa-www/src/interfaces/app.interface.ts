import { AppProps } from 'next/app';
import { ApolloClient } from 'apollo-client';

export interface IPageProps extends AppProps {
  apolloClient: ApolloClient<any>;
  isServer: boolean;
  pageProps: any;
}
