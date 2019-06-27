import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

interface IDefaultLayoutParam {
  component: any;
}

export const DefaultLayout = ({ component: Component, ...rest }: IDefaultLayoutParam & RouteProps) => (
  <Route {...rest} render={(matchProps: any) => <Component {...matchProps} />} />
);
