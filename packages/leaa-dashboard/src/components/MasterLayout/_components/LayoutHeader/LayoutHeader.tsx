import React from 'react';
import { Layout, Row, Col } from 'antd';

import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import { UserMenu } from '../UserMenu/UserMenu';
import style from './style.less';

export const LayoutHeader = () => (
  <Layout.Header className={style['full-layout-header']}>
    <Row type="flex" justify="space-between" align="middle">
      <Col>
        <Breadcrumb />
      </Col>

      <Col>
        <UserMenu />
      </Col>
    </Row>
  </Layout.Header>
);
