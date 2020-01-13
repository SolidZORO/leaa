import { Request, Response } from 'express';
import { NextPageContext } from 'next';
import { ApolloClient } from 'apollo-client';

export interface IGetInitialPropsCtx extends NextPageContext {
  apolloClient: ApolloClient<any>;
  req: Request;
  res: Response;
}
