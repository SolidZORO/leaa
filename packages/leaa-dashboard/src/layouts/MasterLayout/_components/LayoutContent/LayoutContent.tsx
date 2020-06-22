import React from 'react';
import { Layout } from 'antd';
import { Switch } from 'react-router-dom';

import { masterRoute } from '@leaa/dashboard/src/routes';

import style from './style.module.less';

interface IProps {
  children?: React.ReactNode;
}

export const LayoutContent = (props: IProps) => (
  <Layout.Content className={style['full-layout-content']}>
    <Switch>{masterRoute}</Switch>
  </Layout.Content>
);
