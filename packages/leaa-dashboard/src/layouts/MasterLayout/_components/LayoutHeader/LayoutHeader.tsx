import React from 'react';
import cx from 'classnames';
import { Layout } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import { SwitchLanguage } from '@leaa/dashboard/src/components';

import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import { UserMenu } from '../UserMenu/UserMenu';

import style from './style.module.less';

interface IProps extends RouteComponentProps {
  onCallbackSidebarTarget?: () => void;
}

export const LayoutHeader = (props: IProps) => (
  <Layout.Header className={style['full-layout-header']}>
    <div className={cx(style['full-layout-breadcrumb'], 'g-full-layout-breadcrumb')}>
      <Breadcrumb {...props} />
    </div>

    <div className={cx(style['full-layout-toolsbar'], 'g-full-layout-toolsbar')}>
      <div className={cx(style['switch-language-wrapper'], 'switch-language-wrapper')}>
        <SwitchLanguage className={style['switch-language']} placement="topLeft" />
      </div>
      <UserMenu {...props} />
    </div>
  </Layout.Header>
);
