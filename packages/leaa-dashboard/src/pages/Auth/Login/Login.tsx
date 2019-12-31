import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';

import { useMutation } from '@apollo/react-hooks';
import { Row, Col, Button } from 'antd';

import { LOGIN } from '@leaa/dashboard/src/graphqls';
import logo from '@leaa/dashboard/src/assets/images/logo/logo-black.svg';
import { IPage, ICommenFormRef, IAuthInfo, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { authUtil, messageUtil } from '@leaa/dashboard/src/utils';
import { LOGIN_REDIRECT_URL } from '@leaa/dashboard/src/constants';
import { HtmlMeta, SwitchLanguage, BuildInfo } from '@leaa/dashboard/src/components';
import { AuthLoginInput } from '@leaa/common/src/dtos/auth';

import { LoginForm } from './_components/LoginForm/LoginForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const urlParams = queryString.parse(window.location.search);

  // ref
  const loginFormRef = useRef<ICommenFormRef<AuthLoginInput>>(null);

  const [submitLoginMutate, submitLoginMutation] = useMutation<{
    login: IAuthInfo;
  }>(LOGIN, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ login }) {
      if (login?.name && login.flatPermissions?.length === 0) {
        messageUtil.gqlSuccess(t('_page:Auth.Login.notPermissions'));

        return;
      }

      if (login?.name && login.flatPermissions) {
        const authInfo = {
          id: login.id,
          email: login.email,
          name: login.name,
          flatPermissions: login.flatPermissions,
        };

        authUtil.setAuthInfo(authInfo);
      }

      if (login?.authToken && login.authExpiresIn) {
        authUtil.setAuthToken(login.authToken, login.authExpiresIn);

        if (urlParams.redirect) {
          props.history.push(`${urlParams.redirect}`);
        } else {
          props.history.push(LOGIN_REDIRECT_URL);
        }
      }
    },
  });

  useEffect(() => {
    const authIsAvailably = authUtil.checkAuthIsAvailably();

    if (authIsAvailably) {
      props.history.push('/');
    }
  }, []);

  const onSubmit = async () => {
    const submitData: ISubmitData<AuthLoginInput> = await loginFormRef.current?.onValidateForm();

    if (!submitData) return;

    await submitLoginMutate({
      variables: {
        user: {
          email: submitData.email && submitData.email.trim(),
          password: submitData.password,
        },
      },
    });
  };

  const onBack = () => {
    messageUtil.gqlSuccess(t('_page:Auth.Login.backTips'));
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
                <LoginForm ref={loginFormRef} />
              </div>

              <Row className={style['button-row']}>
                <Button
                  className={style['button-login']}
                  loading={submitLoginMutation.loading}
                  size="large"
                  type="primary"
                  htmlType="submit"
                  onClick={onSubmit}
                >
                  {t('_page:Auth.Login.login')}
                </Button>

                <Button className={style['button-back']} size="large" onClick={onBack}>
                  {t('_page:Auth.Login.back')}
                </Button>
              </Row>

              <div className={style['switch-language']}>
                <SwitchLanguage placement="topRight" />
              </div>
            </div>
          </Col>
        </Row>

        <BuildInfo className={style['build-info']} />
      </div>
    </div>
  );
};
