import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

interface IRootLayoutParam extends RouteProps {
  lazyComponent: any;
}

export const RootLayout = ({ lazyComponent: Component, ...rest }: IRootLayoutParam) => (
  <Route {...rest} render={(matchProps: RouteProps) => <Component {...matchProps} />} />
);
