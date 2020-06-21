import React from 'react';
import { RouteProps, RouteComponentProps } from 'react-router-dom';

import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { BaseLayout } from '@leaa/dashboard/src/layouts';

import '@leaa/dashboard/src/styles/global.less';

interface IProps extends RouteProps {
  component: any;
  route: IRouteItem;
}

export const AuthLayout = (props: IProps) => {
  return (
    <BaseLayout
      component={(matchProps: RouteComponentProps) => {
        return (
          <div className="g-full-layout-wrapper">
            <props.component {...matchProps} route={props.route} />
          </div>
        );
      }}
    />
  );
};
