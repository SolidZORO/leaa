import React from 'react';
import cx from 'classnames';
import { RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { transRouterPathToClassName, checkAuthIsAvailably } from '@leaa/dashboard/src/utils';
import '@leaa/dashboard/src/styles/global.less';
import { masterRoute } from '@leaa/dashboard/src/routes';

import { LayoutHeader } from './_components/LayoutHeader/LayoutHeader';
import { LayoutSidebar } from './_components/LayoutSidebar/LayoutSidebar';

import style from './style.module.less';

// Antd Component Indicator Reset
Spin.setDefaultIndicator(<LoadingOutlined spin />);

interface IProps extends RouteComponentProps {
  disableSidebar?: boolean;
  disableHeader?: boolean;
  onCallbackSidebarTarget?: () => void;
}

export const MasterLayout = (props: IProps) => {
  if (!checkAuthIsAvailably()) return <Redirect to={`/login?redirect=${window.location.pathname}`} />;

  const pageClassName = props.location?.pathname
    ? `page-${transRouterPathToClassName(props.location?.pathname)}`
    : null;

  return (
    <div
      className={cx(style['full-layout-wrapper'], 'g-full-layout-wrapper', {
        [`g-full-layout-wrapper--${pageClassName}`]: pageClassName,
      })}
    >
      <Layout className={style['full-layout-inner']} hasSider>
        {!props.disableSidebar && <LayoutSidebar {...props} />}

        <Layout>
          {!props.disableHeader && <LayoutHeader {...props} />}

          <Layout.Content className={style['full-layout-content']}>
            <Switch>
              {masterRoute}
              <Redirect to="/404" />
            </Switch>
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  );
};
