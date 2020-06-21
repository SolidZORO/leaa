import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

interface IBaseLayoutParam extends RouteProps {
  component: any;
}

export const BaseLayout = ({ component: Component, ...rest }: IBaseLayoutParam) => (
  <Route {...rest} render={(matchProps: RouteProps) => <Component {...matchProps} />} />
);
