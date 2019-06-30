import React from 'react';
import { Row, Col } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import logo from '@leaa/dashboard/assets/images/logo/logo-black.svg';
import { LOGIN_REDIRECT_URL } from '@leaa/dashboard/constants';
import { LoginForm } from './_components/LoginForm/LoginForm';

import style from './style.less';

export default (props: RouteComponentProps) => (
  <div className={style['page-wrapper']}>
    <div className={style['login-bg']}>
      <Row>
        <Col xs={24} lg={16} xl={12} xxl={10}>
          <div className={style['login-box']}>
            <div className={style['logo']}>
              <img src={logo} alt="" />
            </div>

            <div className={style['title']}>Dashboard</div>
            <div className={style['description']}>Welcome Back, Please login to your account</div>

            <div className={style['login-form']}>
              <LoginForm onLoginedCallback={() => props.history.push(LOGIN_REDIRECT_URL)} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </div>
);
