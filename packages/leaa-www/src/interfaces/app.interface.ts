import { AppProps } from 'next/app';
import { ApolloClient } from 'apollo-client';
import { Store } from '@leaa/www/src/stores';

export interface IBasePageProps<T = {}> extends AppProps {
  storeState: Store;
  //
  apolloState: any;
  apolloClient: ApolloClient<any>;
  //
  isServer: boolean;
  pageProps: T;
}
