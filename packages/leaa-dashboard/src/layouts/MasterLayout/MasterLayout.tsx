import React, { useEffect } from 'react';
import cx from 'classnames';
import { RouteProps, RouteComponentProps } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { transRouterPathToClassName, checkAuthIsAvailably } from '@leaa/dashboard/src/utils';
import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { RootLayout } from '@leaa/dashboard/src/layouts';
import { history } from '@leaa/dashboard/src/libs';
import '@leaa/dashboard/src/styles/global.less';

import { LayoutHeader } from './_components/LayoutHeader/LayoutHeader';
import { LayoutSidebar } from './_components/LayoutSidebar/LayoutSidebar';
import { LayoutContent } from './_components/LayoutContent/LayoutContent';

import style from './style.module.less';

// Antd Component Indicator Reset
Spin.setDefaultIndicator(<LoadingOutlined spin />);

interface IProps extends RouteProps {
  lazyComponent: any;
  route: IRouteItem;
  disableSidebar?: boolean;
  disableHeader?: boolean;
  onCallbackSidebarTarget?: (status: boolean) => void;
}

export const MasterLayout = (props: IProps) => {
  useEffect(() => {
    const authIsAvailably = checkAuthIsAvailably();

    if (!authIsAvailably) {
      history.push(`/login?redirect=${window.location.pathname}`);
    }
  }, []);

  return (
    <RootLayout
      lazyComponent={(matchProps: RouteComponentProps) => {
        const pageClassName =
          matchProps && matchProps.match.url ? `page-${transRouterPathToClassName(matchProps.match.url)}` : null;

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
                  <props.lazyComponent {...matchProps} route={props.route} />
                </LayoutContent>
              </Layout>
            </Layout>
          </div>
        );
      }}
    />
  );
};
