import { AppProps } from 'next/app';
import { ApolloClient } from 'apollo-client';
import { Store } from '@leaa/www/src/stores';

export interface IBasePageProps<T = {}> extends AppProps {
  apolloState: any;
  apolloClient: ApolloClient<any>;
  //
  isServer: boolean;
  pageProps: T;
  //
  storeState: Store;
  err?: Error;
  //
  children?: any;
  //
  // Component: any;
  // router: any;
}
