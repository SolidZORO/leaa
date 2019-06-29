import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

interface IDefaultLayoutParam extends RouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
}

export const DefaultLayout = ({ component: Component, ...rest }: IDefaultLayoutParam) => (
  <Route {...rest} render={(matchProps: RouteProps) => <Component {...matchProps} />} />
);
