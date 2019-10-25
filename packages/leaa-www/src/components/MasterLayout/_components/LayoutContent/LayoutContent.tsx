import React from 'react';
import { Layout } from 'antd';

import style from './style.less';

interface IProps {
  children: React.ReactNode;
}

export const LayoutContent = ({ children }: IProps) => (
  <Layout.Content className={style['full-layout-content']}>{children}</Layout.Content>
);
