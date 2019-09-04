import { NextPageContext } from 'next';
import { Request, Response } from 'express';
import { ApolloClient } from 'apollo-client';

export interface IGetInitialProps extends NextPageContext {
  apolloClient: ApolloClient<any>;
  req: Request;
  res: Response;
}
