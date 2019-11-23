import React from 'react';
import cx from 'classnames';
import Link from 'next/link';
import { Button, Col, Form, Input, Row, message } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { FormComponentProps } from 'antd/lib/form';
import { AuthSignupInput } from '@leaa/common/src/dtos/auth';
import { SIGNUP_FOR_WWW } from '@leaa/common/src/graphqls';
import { ErrorCard } from '@leaa/www/src/components/ErrorCard';
import { User } from '@leaa/common/src/entrys';
import { authUtil } from '@leaa/www/src/utils';
import Router from 'next/router';

import style from './style.module.less';

interface IProps extends FormComponentProps {
  urlQuery?: { [key: string]: string | string[] };
  className?: string;
  onSignupedCallback?: () => void;
}

const SignupFormInner = (props: IProps) => {
  const { className, form } = props;
  const { getFieldDecorator } = form;

  const [submitSignupMutate, submitSignupMutation] = useMutation<{
    signup: User;
  }>(SIGNUP_FOR_WWW, {
    onCompleted({ signup }) {
      if (signup && signup.name) {
        const authInfo = {
          email: signup.email,
          name: signup.name,
        };

        authUtil.setAuthInfo(authInfo);
      }

      if (signup && signup.authToken && signup.authExpiresIn) {
        authUtil.setAuthToken(signup.authToken, signup.authExpiresIn);

        if (props.onSignupedCallback) {
          props.onSignupedCallback();
        }
      }

      return Router.push('/account');
    },
  });

  const onSubmit = async () => {
    form.validateFieldsAndScroll(async (err: any, formData: AuthSignupInput) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      const variables: { user: AuthSignupInput; oid?: number } = {
        user: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        oid: (props.urlQuery && props.urlQuery.oid && Number(props.urlQuery.oid)) || undefined,
      };

      await submitSignupMutate({ variables });
    });
  };

  return (
    <div className={cx(style['wrapper'], className)}>
      {submitSignupMutation.error ? <ErrorCard error={submitSignupMutation.error} /> : null}

      <Form labelAlign="left" hideRequiredMark>
        <Row gutter={16} className={style['form-row']}>
          <Col xs={24} sm={24}>
            <Form.Item label="Name">
              {getFieldDecorator('name', {
                validateTrigger: ['onBlur'],
                initialValue: `random-${new Date().getTime()}`,
                rules: [{ required: true }],
              })(<Input size="large" placeholder="Name" />)}
            </Form.Item>
          </Col>

          <Col xs={24} sm={24}>
            <Form.Item label="Email">
              {getFieldDecorator('email', {
                validateTrigger: ['onBlur'],
                initialValue: `random-${new Date().getTime()}@leaa.com`,
                rules: [{ required: true }, { type: 'email' }],
              })(<Input size="large" placeholder="Email" />)}
            </Form.Item>
          </Col>

          <Col xs={24} sm={24}>
            <Form.Item label="Password">
              {getFieldDecorator('password', {
                validateTrigger: ['onBlur'],
                initialValue: `random-${new Date().getTime()}`,
                rules: [{ required: true }],
              })(<Input size="large" type="password" placeholder="Password" />)}
            </Form.Item>
          </Col>
        </Row>

        <Row className={style['button-row']}>
          <Col xs={24}>
            <Button
              className={style['button-login']}
              loading={submitSignupMutation.loading}
              size="large"
              type="primary"
              htmlType="submit"
              block
              onClick={onSubmit}
            >
              Sign Up
            </Button>
          </Col>
        </Row>

        <Row className={style['register-row']}>
          <Link href="/login" prefetch={false}>
            <a>Already have an account? Log In</a>
          </Link>
        </Row>
      </Form>
    </div>
  );
};

export default Form.create<IProps>()(SignupFormInner);
