import React from 'react';
import cx from 'classnames';
import { RouteProps } from 'react-router-dom';
import { Layout } from 'antd';

// import { AuthUtil } from '@src/utils';

import { DefaultLayout } from '@leaa/dashboard/components/DefaultLayout';
import { LayoutHeader } from './_components/LayoutHeader/LayoutHeader';
import { LayoutSidebar } from './_components/LayoutSidebar/LayoutSidebar';
import { LayoutContent } from './_components/LayoutContent/LayoutContent';

import '@leaa/dashboard/styles/global.less';
import style from './style.less';

interface IProps extends RouteProps {
  component: any;
  matchProps?: {
    url?: string;
  };
}

export class MasterLayout extends React.PureComponent<IProps> {
  componentDidMount() {
    // if (!AuthUtil.checkAuthIsAvailably()) {
    //   Router.push('/login');
    // }
  }

  render() {
    return (
      <DefaultLayout
        {...this.props}
        component={(matchProps: any) => {
          // pageLayoutFn.checkDashboardAuth('masterLayout', matchProps);

          const pageClassName = '';
          // this.props.matchProps && this.props.matchProps.url
          //   ? `page-${convertUtil.routerPathToClassName(this.props.matchProps.url)}`
          //   : null;

          return (
            <div
              className={cx(style['full-layout-wrapper'], 'g-full-layout-wrapper', {
                [`g-full-layout-wrapper--${pageClassName}`]: pageClassName,
              })}
            >
              <Layout className={style['full-layout-inner']} hasSider>
                <LayoutSidebar />

                <Layout>
                  <LayoutHeader />
                  <LayoutContent contentChildren={this.props.children} />
                </Layout>
              </Layout>
            </div>
          );
        }}
      />
    );
  }
}
