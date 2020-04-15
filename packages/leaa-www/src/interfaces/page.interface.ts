import { IRequest, IResponse } from '@leaa/www/src/interfaces';
import { NextPageContext } from 'next';
import { ApolloClient } from 'apollo-client';

export interface IGetInitialPropsCtx extends NextPageContext {
  apolloClient: ApolloClient<any>;
  req: IRequest | any;
  res: IResponse;
}
