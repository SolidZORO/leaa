import React from 'react';
import cx from 'classnames';
import Link from 'next/link';
import { Button, Col, Form, Input, Row, message } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { FormComponentProps } from 'antd/lib/form';
import { AuthLoginInput } from '@leaa/common/src/dtos/auth';
import { LOGIN_FOR_WWW } from '@leaa/common/src/graphqls';
import { ErrorCard } from '@leaa/www/components/ErrorCard';
import { authUtil } from '@leaa/www/utils';
import Router from 'next/router';

import style from './style.less';

interface IProps extends FormComponentProps {
  className?: string;
  onLoginedCallback?: () => void;
}

const LoginFormInner = (props: IProps) => {
  const { className, form } = props;
  const { getFieldDecorator } = form;

  const [submitLoginMutate, submitLoginMutation] = useMutation<{
    login: any;
  }>(LOGIN_FOR_WWW, {
    onCompleted({ login }) {
      if (login && login.name) {
        const authInfo = {
          id: login.id,
          email: login.email,
          name: login.name,
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
    form.validateFieldsAndScroll(async (err: any, formData: AuthLoginInput) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      const variables: { user: AuthLoginInput } = {
        user: {
          email: formData.email,
          password: formData.password,
        },
      };

      await submitLoginMutate({ variables });
    });
  };

  return (
    <div className={cx(style['wrapper'], className)}>
      {submitLoginMutation.error ? <ErrorCard error={submitLoginMutation.error} /> : null}

      <Form labelAlign="left" hideRequiredMark>
        <Row gutter={16} className={style['form-row']}>
          <Col xs={24} sm={24}>
            <Form.Item label="Email">
              {getFieldDecorator('email', {
                validateTrigger: ['onBlur'],
                initialValue: 'admin@leaa.com',
                rules: [{ required: true }],
              })(<Input size="large" placeholder="Email" />)}
            </Form.Item>
          </Col>

          <Col xs={24} sm={24}>
            <Form.Item label="Password">
              {getFieldDecorator('password', {
                validateTrigger: ['onBlur'],
                initialValue: 'h8Hx9qvPKoHMLQgj',
                rules: [{ required: true }],
              })(<Input size="large" type="password" placeholder="Password" />)}
            </Form.Item>
          </Col>
        </Row>

        <Row className={style['button-row']}>
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

        <Row className={style['forget-row']}>
          <Link href="/forget" prefetch={false}>
            <a>Forget password?</a>
          </Link>
        </Row>

        <Row className={style['register-row']}>
          <Link href="/register" prefetch={false}>
            <a>Don’t have an account? Register?</a>
          </Link>
        </Row>
      </Form>
    </div>
  );
};

export default Form.create<IProps>()(LoginFormInner);
