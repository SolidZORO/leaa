import React from 'react';
import { Layout, Row, Col } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import { UserMenu } from '../UserMenu/UserMenu';
import style from './style.less';

interface IProps extends RouteComponentProps {}

export const LayoutHeader = (props: IProps) => (
  <Layout.Header className={style['full-layout-header']}>
    <Row type="flex" justify="space-between" align="middle">
      <Col>
        <Breadcrumb />
      </Col>

      <Col>
        <UserMenu {...props} />
      </Col>
    </Row>
  </Layout.Header>
);
