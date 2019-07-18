import React from 'react';
import { Layout, Row, Col } from 'antd';
import Link from 'next/link';

import style from './style.less';

interface IProps {}

export const LayoutHeader = (props: IProps) => (
  <Layout.Header className={style['full-layout-header']}>
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/ram">
          <a>Ram</a>
        </Link>
      </li>
    </ul>
  </Layout.Header>
);
