import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import qs from 'qs';
import { Row, Col, Button } from 'antd';
// import { LOGIN, LOGIN_BY_TICKET, GET_DEMO_DATA } from '@leaa/dashboard/src/graphqls';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes } from '@leaa/dashboard/src/interfaces';
import {
  setAuthToken,
  setAuthInfo,
  checkAuthIsAvailably,
  removeGuestToken,
  msg,
  errorMsg,
  ajax,
  setAjaxToken,
} from '@leaa/dashboard/src/utils';
import { LOGIN_REDIRECT_URL } from '@leaa/dashboard/src/constants';
import { User } from '@leaa/common/src/entrys';
import { AuthLoginInput } from '@leaa/common/src/dtos/auth';
import { envConfig } from '@leaa/dashboard/src/configs';
import { HtmlMeta, SwitchLanguage, BuildInfo, AuthGithubButton } from '@leaa/dashboard/src/components';

import logo from '@leaa/dashboard/src/assets/images/logo/logo-black.svg';

import { LoginForm } from './_components/LoginForm/LoginForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const urlObject = qs.parse(window.location.search, { ignoreQueryPrefix: true });

  const [loginErrorCount, setLoginErrorCount] = useState<number>(0);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const loginFormRef = useRef<ICommenFormRef<AuthLoginInput>>(null);

  const clearGuestInfo = () => {
    setLoginErrorCount(0);
    removeGuestToken();
  };

  const setLogin = (login: any) => {
    if (login?.name && login.flatPermissions?.length === 0) {
      msg(t('_page:Auth.Login.notPermissions'));

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

      setAuthInfo(authInfo);
    }

    if (login?.authToken && login.authExpiresIn) {
      setAuthToken(login.authToken, login.authExpiresIn);

      if (urlObject.redirect) {
        props.history.push(`${urlObject.redirect}`);
      } else {
        props.history.push(LOGIN_REDIRECT_URL);
      }
    }
  };

  useEffect(() => {
    const authIsAvailably = checkAuthIsAvailably();

    if (authIsAvailably) {
      clearGuestInfo();
      props.history.push('/');
    }
  }, []);

  // useEffect(() => {
  //   // if (qs.ticket) {
  //   //   (async () => {
  //   //     await submitLoginByTicketMutate({
  //   //       variables: { ticket: qs.ticket },
  //   //     });
  //   //   })();
  //   // }
  // }, [qs.ticket]);

  const onSubmit = async () => {
    const submitData: ISubmitData<AuthLoginInput> = await loginFormRef.current?.onValidateForm();

    if (!submitData) return;

    setSubmitLoading(true);

    ajax
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/auth/login`, submitData)
      .then((res: IHttpRes<User>) => {
        setLogin(res.data.data);

        if (res.data.data?.authToken) setAjaxToken(res.data.data.authToken);
      })
      .catch((err) => {
        errorMsg(err.message);
        return props.history.push('/login');
      })
      .finally(() => setSubmitLoading(false));
  };

  const onBack = () => {
    msg(t('_page:Auth.Login.backTips'));
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
                <LoginForm ref={loginFormRef} onPressSubmitCallback={onSubmit} loginErrorCount={loginErrorCount} />
              </div>

              <div className={style['local-button']}>
                <Row className={style['button-row']}>
                  <Button
                    className={style['button-login']}
                    loading={submitLoading}
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
