import React, { useEffect } from 'react';
import cx from 'classnames';
import { RouteProps, RouteComponentProps } from 'react-router-dom';
import { Layout } from 'antd';
import animateScrollTo from 'animated-scroll-to';

import { urlUtil, authUtil } from '@leaa/dashboard/utils';
import { IRouteItem } from '@leaa/dashboard/interfaces';
import { DefaultLayout } from '@leaa/dashboard/components/DefaultLayout';
import { LayoutHeader } from './_components/LayoutHeader/LayoutHeader';
import { LayoutSidebar } from './_components/LayoutSidebar/LayoutSidebar';
import { LayoutContent } from './_components/LayoutContent/LayoutContent';

import '@leaa/dashboard/styles/global.less';
import style from './style.less';

interface IProps extends RouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  route: IRouteItem;
  disableSidebar?: boolean;
  disableHeader?: boolean;
}

export const MasterLayout = (props: IProps) => {
  return (
    <DefaultLayout
      component={(matchProps: RouteComponentProps) => {
        const pageClassName =
          matchProps && matchProps.match.url ? `page-${urlUtil.routerPathToClassName(matchProps.match.url)}` : null;

        useEffect(() => {
          matchProps.history.listen(() => animateScrollTo(0));

          const authIsAvailably = authUtil.checkAuthIsAvailably();

          if (!authIsAvailably) {
            matchProps.history.push('/login');
          }
        });

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
