import React, { useEffect } from 'react';
import cx from 'classnames';
import { RouteProps, RouteComponentProps } from 'react-router-dom';
import animateScrollTo from 'animated-scroll-to';
import { Layout, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { routerPathToClassName, checkAuthIsAvailably } from '@leaa/dashboard/src/utils';
import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { DefaultLayout } from '@leaa/dashboard/src/components';

import { LayoutHeader } from './_components/LayoutHeader/LayoutHeader';
import { LayoutSidebar } from './_components/LayoutSidebar/LayoutSidebar';
import { LayoutContent } from './_components/LayoutContent/LayoutContent';

import '@leaa/dashboard/src/styles/global.less';
import style from './style.module.less';

// Antd Component Indicator Reset
Spin.setDefaultIndicator(<LoadingOutlined spin />);

interface IProps extends RouteProps {
  component: any;
  route: IRouteItem;
  disableSidebar?: boolean;
  disableHeader?: boolean;
  onCallbackSidebarTarget?: (status: boolean) => void;
}

export const MasterLayout = (props: IProps) => {
  return (
    <DefaultLayout
      component={(matchProps: RouteComponentProps) => {
        const pageClassName =
          matchProps && matchProps.match.url ? `page-${routerPathToClassName(matchProps.match.url)}` : null;

        useEffect(() => {
          matchProps.history.listen(() => animateScrollTo(0));

          const authIsAvailably = checkAuthIsAvailably();

          if (!authIsAvailably) {
            matchProps.history.push(`/login?redirect=${window.location.pathname}`);
          }
        }, []);

        return (
          <div
            className={cx(style['full-layout-wrapper'], 'g-full-layout-wrapper', {
              [`g-full-layout-wrapper--${pageClassName}`]: pageClassName,
            })}
          >
            <Layout className={style['full-layout-inner']} hasSider>
              {!props.disableSidebar && <LayoutSidebar {...matchProps} />}

              <Layout>
                {!props.disableHeader && <LayoutHeader {...matchProps} />}
                <LayoutContent>
                  <props.component {...matchProps} route={props.route} />
                </LayoutContent>
              </Layout>
            </Layout>
          </div>
        );
      }}
    />
  );
};
