import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Button, Col, Form, Input, Row } from 'antd';
import { useMutation } from '@apollo/react-hooks';

import { User } from '@leaa/common/src/entrys';
import { AuthSignupInput } from '@leaa/common/src/dtos/auth';
import { SIGNUP_FOR_WWW } from '@leaa/common/src/graphqls';
import { authUtil, messageUtil } from '@leaa/www/src/utils';

import style from './style.module.less';

interface IProps {
  urlQuery?: { [key: string]: string | string[] };
  onSignupedCallback?: () => void;
  className?: string;
}

export const SignupForm = (props: IProps) => {
  const [form] = Form.useForm();

  const [submitVariables, setSubmitVariables] = useState<{ user: AuthSignupInput; oid?: number }>();
  const [submitSignupMutate, submitSignupMutation] = useMutation<{
    signup: User;
  }>(SIGNUP_FOR_WWW, {
    variables: submitVariables,
    onCompleted({ signup }) {
      if (signup?.name) {
        const authInfo = {
          email: signup.email,
          name: signup.name,
        };

        authUtil.setAuthInfo(authInfo);
      }

      if (signup?.authToken && signup.authExpiresIn) {
        authUtil.setAuthToken(signup.authToken, signup.authExpiresIn);

        if (props.onSignupedCallback) {
          props.onSignupedCallback();
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
      messageUtil.error(error.errorFields && error.errorFields[0]?.errors[0]);
    }

    await setSubmitVariables({
      user: submitData,
      oid: (props.urlQuery?.oid && Number(props.urlQuery.oid)) || undefined,
    });
    await submitSignupMutate();
  };

  const onUpdateForm = () => {
    form.setFieldsValue({
      name: `signup-${new Date().getTime()}`,
      email: `signup-${new Date().getTime()}@leaa.com`,
      password: `signup-${new Date().getTime()}@leaa.com`,
    });

    return undefined;
  };

  useEffect(() => onUpdateForm(), [form]);

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Form form={form} layout="vertical" hideRequiredMark>
        <Row gutter={16} className={style['form-row']}>
          <Col xs={24}>
            <Form.Item name="name" rules={[{ required: true }]} validateTrigger={['onBlur']} label="Name">
              <Input size="large" placeholder="Name" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="email"
              rules={[{ required: true }, { type: 'email' }]}
              validateTrigger={['onBlur']}
              label="Email"
            >
              <Input size="large" placeholder="Email" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="password" rules={[{ required: true }]} validateTrigger={['onBlur']} label="Password">
              <Input.Password size="large" placeholder="Password" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} className={style['button-row']}>
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
      </Form>

      <div className={style['toolsbar']}>
        <Row className={style['register-row']}>
          <Link href="/login" prefetch={false}>
            <a>Already have an account? Log In</a>
          </Link>
        </Row>
      </div>
    </div>
  );
};
