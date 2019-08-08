import { NextPageContext } from 'next';
import { ApolloClient } from 'apollo-client';

import { IReqCookies } from '@leaa/www/interfaces/auth.interface';

// export type IPage = IPageProps & ILang;
export interface IPageApollo extends NextPageContext {
  apolloClient: ApolloClient<any>;
  cookies: any;
}

export type IGetInitialProps = IPageApollo & { req: IReqCookies };
