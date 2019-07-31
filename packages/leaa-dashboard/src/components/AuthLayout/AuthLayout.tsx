import React from 'react';
import { RouteProps, RouteComponentProps } from 'react-router-dom';

import { IRouteItem } from '@leaa/dashboard/interfaces';
import { DefaultLayout } from '@leaa/dashboard/components/DefaultLayout';

import '@leaa/dashboard/styles/global.less';

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
