import React from 'react';
import { Layout } from 'antd';

import style from './style.less';

interface IProps {
  contentChildren: React.ReactNode;
}

export const LayoutContent = ({ contentChildren }: IProps) => (
  <p>222</p>
  // <Layout.Content className={style['full-layout-content']}>{contentChildren}</Layout.Content>
);
