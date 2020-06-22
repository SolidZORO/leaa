import React, { useEffect } from 'react';
import cx from 'classnames';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { transRouterPathToClassName, checkAuthIsAvailably } from '@leaa/dashboard/src/utils';
import { IRouteItem } from '@leaa/dashboard/src/interfaces';
import { history } from '@leaa/dashboard/src/libs';
import '@leaa/dashboard/src/styles/global.less';

import { LayoutHeader } from './_components/LayoutHeader/LayoutHeader';
import { LayoutSidebar } from './_components/LayoutSidebar/LayoutSidebar';
import { LayoutContent } from './_components/LayoutContent/LayoutContent';

import style from './style.module.less';

// Antd Component Indicator Reset
Spin.setDefaultIndicator(<LoadingOutlined spin />);

interface IProps extends RouteComponentProps {
  lazyComponent: any;
  route: IRouteItem;
  disableSidebar?: boolean;
  disableHeader?: boolean;
  onCallbackSidebarTarget?: (status: boolean) => void;
}

// export const MasterLayoutInner = (props: IProps) => {
export const MasterLayout = withRouter((props: IProps) => {
  console.log('MSTER', props);

  useEffect(() => {
    const authIsAvailably = checkAuthIsAvailably();

    if (!authIsAvailably) {
      history.push(`/login?redirect=${window.location.pathname}`);
    }
  }, []);

  console.log(props);
  const pageClassName = props && props.match.url ? `page-${transRouterPathToClassName(props.match.url)}` : null;

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
          <LayoutContent />
        </Layout>
      </Layout>
    </div>
  );
});
