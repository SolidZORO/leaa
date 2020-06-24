import React from 'react';
import cx from 'classnames';
import { Layout } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import { SwitchLanguage } from '@leaa/dashboard/src/components';

import { NavBreadcrumb } from '@leaa/dashboard/src/layouts/MasterLayout/_components/NavBreadcrumb/NavBreadcrumb';
import { UserMenu } from '../UserMenu/UserMenu';

import style from './style.module.less';

interface IProps extends RouteComponentProps {
  disableSidebar?: boolean;
  disableHeader?: boolean;
}

export const LayoutHeader = (props: IProps) => (
  <Layout.Header className={style['full-layout-header']}>
    <div className={cx(style['full-layout-breadcrumb'], 'g-full-layout-breadcrumb')}>
      <NavBreadcrumb {...props} />
    </div>

    <div className={cx(style['full-layout-toolsbar'], 'g-full-layout-toolsbar')}>
      <div className={cx(style['switch-language-wrapper'], 'switch-language-wrapper')}>
        <SwitchLanguage className={style['switch-language']} placement="topLeft" />
      </div>
      <UserMenu {...props} />
    </div>
  </Layout.Header>
);
