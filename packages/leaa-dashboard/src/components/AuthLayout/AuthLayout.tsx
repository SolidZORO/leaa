import React from 'react';
import { RouteProps, RouteComponentProps } from 'react-router-dom';

import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { DefaultLayout } from '@leaa/dashboard/src/components';

import '@leaa/dashboard/src/styles/style.global.less';

interface IProps extends RouteProps {
  component: any;
  route: IRouteItem;
}

export const AuthLayout = (props: IProps) => {
  return (
    <DefaultLayout
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
