import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Col, Checkbox, Form, Input, Row, message } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { FormComponentProps } from 'antd/lib/form';

import { IAuthInfo } from '@leaa/dashboard/src/interfaces';
import { AuthLoginInput } from '@leaa/common/src/dtos/auth';
import { LOGIN } from '@leaa/common/src/graphqls';
import { authUtil, messageUtil } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps extends FormComponentProps {
  className?: string;
  onLoginedCallback?: () => void;
}

const LoginFormInner = (props: IProps) => {
  const { t } = useTranslation();

  const { className, form } = props;
  const { getFieldDecorator } = form;

  const [submitLoginMutate, submitLoginMutation] = useMutation<{
    login: IAuthInfo;
  }>(LOGIN, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ login }) {
      if (login && login.name && login.flatPermissions && login.flatPermissions.length === 0) {
        message.error(t('_page:Auth.Login.notPermissions'));

        return;
      }

      if (login && login.name && login.flatPermissions) {
        const authInfo = {
          id: login.id,
          email: login.email,
          name: login.name,
          flatPermissions: login.flatPermissions,
        };

        authUtil.setAuthInfo(authInfo);
      }

      if (login && login.authToken && login.authExpiresIn) {
        authUtil.setAuthToken(login.authToken, login.authExpiresIn);

        if (props.onLoginedCallback) {
          props.onLoginedCallback();
        }
      }
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
          email: formData.email && formData.email.trim(),
          password: formData.password,
        },
      };

      await submitLoginMutate({ variables });
    });
  };

  const onBack = async () => {
    message.info(t('_page:Auth.Login.backTips'));
  };

  return (
    <div className={cx(style['wrapper'], className)}>
      <Form>
        <Row gutter={16} className={style['form-row']}>
          <Col xs={24} sm={12}>
            <Form.Item label={t('_page:Auth.Login.email')}>
              {getFieldDecorator('email', {
                validateTrigger: ['onBlur'],
                initialValue: 'admin@leaa.com',
                rules: [{ required: true }],
              })(<Input size="large" placeholder={t('_page:Auth.Login.email')} />)}
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label={t('_page:Auth.Login.password')}>
              {getFieldDecorator('password', {
                validateTrigger: ['onBlur'],
                initialValue: 'h8Hx9qvPKoHMLQgj',
                rules: [{ required: true }],
              })(<Input size="large" type="password" placeholder={t('_page:Auth.Login.password')} />)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} className={style['remember-row']}>
          <Col xs={24} sm={12}>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>{t('_page:Auth.Login.rememberMe')}</Checkbox>)}
            </Form.Item>
          </Col>
        </Row>

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
      </Form>
    </div>
  );
};

export const LoginForm = Form.create<IProps>()(LoginFormInner);
