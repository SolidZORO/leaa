import React from 'react';
import { RouteProps, RouteComponentProps } from 'react-router-dom';

import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { RootLayout } from '@leaa/dashboard/src/layouts';

import '@leaa/dashboard/src/styles/global.less';

interface IProps extends RouteProps {
  lazyComponent: any;
  route: IRouteItem;
}

export const AuthLayout = (props: IProps) => {
  return (
    <RootLayout
      lazyComponent={(matchProps: RouteComponentProps) => {
        return (
          <div className="g-full-layout-wrapper">
            <props.lazyComponent {...matchProps} route={props.route} />
          </div>
        );
      }}
    />
  );
};
