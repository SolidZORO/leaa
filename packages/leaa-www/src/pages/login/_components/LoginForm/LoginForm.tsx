import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Button, Col, Form, Input, Row } from 'antd';
import { useMutation } from '@apollo/react-hooks';

import { User } from '@leaa/common/src/entrys';
import { AuthLoginInput } from '@leaa/common/src/dtos/auth';
import { LOGIN_FOR_WWW } from '@leaa/www/src/graphqls';

import { authUtil, msgUtil } from '@leaa/www/src/utils';

import WechatLoginButton from '../WechatLoginButton/WechatLoginButton';
import PhoneLoginButton from '../PhoneLoginButton/PhoneLoginButton';

import style from './style.module.less';

interface IProps {
  className?: string;
  onLoginedCallback?: () => void;
}

export default (props: IProps) => {
  const [form] = Form.useForm();

  const [submitVariables, setSubmitVariables] = useState<{ user: AuthLoginInput }>();
  const [submitLoginMutate, submitLoginMutation] = useMutation<{ login: User }>(LOGIN_FOR_WWW, {
    variables: submitVariables,
    onCompleted({ login }) {
      if (login && login.name) {
        const authInfo = {
          id: login.id,
          email: login.email,
          name: login.name,
          avatar_url: login.avatar_url,
        };

        authUtil.setAuthInfo(authInfo);
      }

      if (login && login.authToken && login.authExpiresIn) {
        authUtil.setAuthToken(login.authToken, login.authExpiresIn);

        if (props.onLoginedCallback) {
          props.onLoginedCallback();
        }
      }

      return Router.push('/account');
    },
  });

  const onSubmit = async () => {
    let submitData: any;

    try {
      submitData = await form.validateFields();
    } catch (error) {
      msgUtil.error(error.errorFields && error.errorFields[0]?.errors[0]);
    }

    console.log(submitData);

    await setSubmitVariables({ user: submitData });
    await submitLoginMutate();
  };

  const onUpdateForm = () => {
    form.setFieldsValue({
      email: 'admin@local.com',
      password: 'h8Hx9qvPKoHMLQgj',
    });

    return undefined;
  };

  useEffect(() => onUpdateForm(), [form]);

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Form form={form} layout="vertical" hideRequiredMark>
        <Row gutter={16} className={style['form-row']}>
          <Col xs={24}>
            <Form.Item name="email" rules={[{ required: true }]} validateTrigger={['onBlur']} label="Email">
              <Input size="large" placeholder="Email" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="password" rules={[{ required: true }]} label="Password">
              <Input.Password size="large" placeholder="Password" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} className={style['button-row']}>
          <Col xs={24}>
            <Button
              className={style['button-login']}
              loading={submitLoginMutation.loading}
              size="large"
              type="primary"
              htmlType="submit"
              block
              onClick={onSubmit}
            >
              Login
            </Button>
          </Col>
        </Row>
      </Form>

      <div className={style['toolsbar']}>
        <Row className={style['forget-row']}>
          <Link href="/forget" prefetch={false}>
            <a>Forget password?</a>
          </Link>
        </Row>

        <Row className={style['oauth-row']} justify="center">
          <Col className={cx(style['oauth-item'], style['oauth-item--wechat'])}>
            <WechatLoginButton />
          </Col>
          <Col className={cx(style['oauth-item'], style['oauth-item--phone'])}>
            <PhoneLoginButton />
          </Col>
        </Row>

        <Row className={style['signup-row']} justify="center">
          <Link href="/signup" prefetch={false}>
            <a>Don’t have an account? Sign Up?</a>
          </Link>
        </Row>
      </div>
    </div>
  );
};
