import React from 'react';
import { Layout, Row, Col } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import { UserMenu } from '../UserMenu/UserMenu';
import { SwitchLanguage } from '../../../SwitchLanguage/SwitchLanguage';

import style from './style.less';

interface IProps extends RouteComponentProps {}

export const LayoutHeader = (props: IProps) => (
  <Layout.Header className={style['full-layout-header']}>
    <Row type="flex" justify="space-between" align="middle">
      <Col className={style['breadcrumb']}>
        <Breadcrumb {...props} />
      </Col>

      <Col className={style['toolsbar']}>
        <UserMenu {...props} />
      </Col>
    </Row>
  </Layout.Header>
);
