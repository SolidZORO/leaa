import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

interface IDefaultLayoutParam extends RouteProps {
  component: any;
}

export const DefaultLayout = ({ component: Component, ...rest }: IDefaultLayoutParam) => (
  <Route {...rest} render={(matchProps: RouteProps) => <Component {...matchProps} />} />
);
