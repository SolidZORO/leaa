import { NextPageContext } from 'next';
import { Request, Response } from 'express';
import { ApolloClient } from 'apollo-client';

import { IReqCookies } from '@leaa/www/interfaces/auth.interface';

// export type IPage = IPageProps & ILang;
export interface IPageApollo extends NextPageContext {
  apolloClient: ApolloClient<any>;
  cookies: any;
  req: Request;
  res: Response;
}

export type IGetInitialProps = IPageApollo & { req: IReqCookies };
