import React from 'react';
import { RouteProps, RouteComponentProps } from 'react-router-dom';

import { DefaultLayout } from '@leaa/dashboard/components/DefaultLayout';

import '@leaa/dashboard/styles/global.less';

interface IProps extends RouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
}

export const AuthLayout = (props: IProps) => {
  return (
    <DefaultLayout
      component={(matchProps: RouteComponentProps) => {
        return (
          <div className="g-full-layout-wrapper">
            <props.component {...matchProps} />
          </div>
        );
      }}
    />
  );
};
