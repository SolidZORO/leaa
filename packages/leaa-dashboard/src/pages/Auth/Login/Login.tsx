import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';

import { useMutation, useQuery } from '@apollo/react-hooks';
import { Row, Col, Button } from 'antd';

import { LOGIN, LOGIN_BY_TICKET, GET_DEMO_DATA } from '@leaa/dashboard/src/graphqls';
import { IPage, ICommenFormRef, IAuthInfo, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { authUtil, msgUtil } from '@leaa/dashboard/src/utils';
import { LOGIN_REDIRECT_URL } from '@leaa/dashboard/src/constants';
import { AuthLoginInput } from '@leaa/common/src/dtos/auth';
import { DemoDataObject } from '@leaa/common/src/dtos/demo';
import { envConfig } from '@leaa/dashboard/src/configs';
import { HtmlMeta, SwitchLanguage, BuildInfo, AuthGithubButton } from '@leaa/dashboard/src/components';

import logo from '@leaa/dashboard/src/assets/images/logo/logo-black.svg';

import { LoginForm } from './_components/LoginForm/LoginForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const qs = queryString.parse(window.location.search);
  const [loginErrorCount, setLoginErrorCount] = useState<number>(0);

  // ref
  const loginFormRef = useRef<ICommenFormRef<AuthLoginInput>>(null);

  const clearGuestInfo = () => {
    setLoginErrorCount(0);
    authUtil.removeGuestToken();
  };

  const setLogin = (login: any) => {
    if (login?.name && login.flatPermissions?.length === 0) {
      msgUtil.message(t('_page:Auth.Login.notPermissions'));

      return;
    }

    if (login?.name && login.flatPermissions) {
      const authInfo = {
        id: login.id,
        email: login.email,
        name: login.name,
        avatar_url: login.avatar_url,
        flatPermissions: login.flatPermissions,
      };

      authUtil.setAuthInfo(authInfo);
    }

    if (login?.authToken && login.authExpiresIn) {
      authUtil.setAuthToken(login.authToken, login.authExpiresIn);

      if (qs.redirect) {
        props.history.push(`${qs.redirect}`);
      } else {
        props.history.push(LOGIN_REDIRECT_URL);
      }
    }
  };

  // query
  const getDemoDataQuery = envConfig.DEMO_MODE
    ? useQuery<{ demoData: DemoDataObject }>(GET_DEMO_DATA, {
        fetchPolicy: 'network-only',
      })
    : undefined;

  // mutation
  const [submitLoginMutate, submitLoginMutation] = useMutation<{
    login: IAuthInfo;
  }>(LOGIN, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ login }) {
      clearGuestInfo();
      setLogin(login);
    },
    onError: () => {
      setLoginErrorCount((prev) => prev + 1);
    },
  });

  const [submitLoginByTicketMutate] = useMutation<{
    loginByTicket: IAuthInfo;
  }>(LOGIN_BY_TICKET, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ loginByTicket }) {
      clearGuestInfo();
      setLogin(loginByTicket);
    },
    onError: (e) => {
      msgUtil.error(e.message);

      return props.history.push('/login');
    },
  });

  useEffect(() => {
    const authIsAvailably = authUtil.checkAuthIsAvailably();

    if (authIsAvailably) {
      clearGuestInfo();
      props.history.push('/');
    }
  }, []);

  useEffect(() => {
    if (qs.ticket) {
      (async () => {
        await submitLoginByTicketMutate({
          variables: { ticket: qs.ticket },
        });
      })();
    }
  }, [qs.ticket]);

  const onSubmit = async () => {
    const submitData: ISubmitData<AuthLoginInput> = await loginFormRef.current?.onValidateForm();

    if (!submitData) return;

    await submitLoginMutate({
      variables: {
        user: {
          email: submitData.email && submitData.email.trim(),
          password: submitData.password,
          captcha: submitData.captcha,
          guestToken: authUtil.getGuestToken(),
        },
      },
    });
  };

  const onBack = () => {
    msgUtil.message(t('_page:Auth.Login.backTips'));
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
                <LoginForm
                  ref={loginFormRef}
                  initialValues={getDemoDataQuery?.data?.demoData?.loginAccountByAdmin}
                  onPressSubmitCallback={onSubmit}
                  loginErrorCount={loginErrorCount}
                />
              </div>

              <div className={style['local-button']}>
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
              </div>

              <div className={style['auth-button']}>
                <AuthGithubButton />
              </div>

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
