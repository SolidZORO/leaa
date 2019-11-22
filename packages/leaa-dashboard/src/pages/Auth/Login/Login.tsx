import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'antd';
import queryString from 'query-string';

import logo from '@leaa/dashboard/src/assets/images/logo/logo-black.svg';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { authUtil } from '@leaa/dashboard/src/utils';
import { LOGIN_REDIRECT_URL } from '@leaa/dashboard/src/constants';
import { HtmlMeta, SwitchLanguage } from '@leaa/dashboard/src/components';

import { LoginForm } from './_components/LoginForm/LoginForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  const urlParams = queryString.parse(window.location.search);

  useEffect(() => {
    const authIsAvailably = authUtil.checkAuthIsAvailably();

    if (authIsAvailably) {
      props.history.push('/');
    }
  });

  const onLoginedCallback = () => {
    if (urlParams.redirect) {
      props.history.push(`${urlParams.redirect}`);
    } else {
      props.history.push(LOGIN_REDIRECT_URL);
    }
  };

  return (
    <div className={style['wrapper']}>
      <div className={style['login-bg']}>
        <HtmlMeta title={t(`${props.route.namei18n}`)} />

        <Row>
          <Col xs={24} lg={16} xl={12} xxl={10}>
            <div className={style['login-box']}>
              <div className={style['logo']}>
                <img src={logo} alt="" />
              </div>

              <div className={style['title']}>{t('_page:Auth.Login.title')}</div>
              <div className={style['description']}>{t('_page:Auth.Login.subTitle')}</div>

              <div className={style['login-form']}>
                <LoginForm onLoginedCallback={onLoginedCallback} />
              </div>

              <div className={style['switch-language']}>
                <SwitchLanguage placement="topRight" />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
