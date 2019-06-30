import React from 'react';
import cx from 'classnames';
import { RouteProps, RouteComponentProps } from 'react-router-dom';
import { Layout } from 'antd';

import { urlUtil } from '@leaa/dashboard/utils';
import { DefaultLayout } from '@leaa/dashboard/components/DefaultLayout';
import { LayoutHeader } from './_components/LayoutHeader/LayoutHeader';
import { LayoutSidebar } from './_components/LayoutSidebar/LayoutSidebar';
import { LayoutContent } from './_components/LayoutContent/LayoutContent';

import '@leaa/dashboard/styles/global.less';
import style from './style.less';

interface IProps extends RouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  disableSidebar?: boolean;
  disableHeader?: boolean;
}

export const MasterLayout = (props: IProps) => (
  <DefaultLayout
    component={(matchProps: RouteComponentProps) => {
      const pageClassName =
        matchProps && matchProps.match.url ? `page-${urlUtil.routerPathToClassName(matchProps.match.url)}` : null;

      return (
        <div
          className={cx(style['full-layout-wrapper'], 'g-full-layout-wrapper', {
            [`g-full-layout-wrapper--${pageClassName}`]: pageClassName,
          })}
        >
          <Layout className={style['full-layout-inner']} hasSider>
            {!props.disableSidebar && <LayoutSidebar />}

            <Layout>
              {!props.disableHeader && <LayoutHeader />}
              <LayoutContent>
                <props.component {...matchProps} />
              </LayoutContent>
            </Layout>
          </Layout>
        </div>
      );
    }}
  />
);
