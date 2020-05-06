import cx from 'classnames';
import React, { useEffect, forwardRef, useState, useImperativeHandle } from 'react';
import { Col, Form, Input, Row, Checkbox, Button } from 'antd';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';

import { GET_GUEST } from '@leaa/dashboard/src/graphqls';
import { LoginAccount } from '@leaa/common/src/dtos/demo';
import { Verification } from '@leaa/common/src/entrys';
import { authUtil } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps {
  className?: string;
  loading?: boolean;
  loginErrorCount?: number;
  // guest?: Verification;
  initialValues?: LoginAccount;
  onPressSubmitCallback?: () => void;
}

export const LoginForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const getGuestVariables = { token: authUtil.getGuestToken() };
  const getGuestQuery = useQuery<{ guest: Verification }>(GET_GUEST, {
    variables: getGuestVariables,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data.guest.token) authUtil.setGuestToken(data.guest.token);
    },
  });

  const onValidateForm = async () => {
    try {
      return await form.validateFields();
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (props.initialValues) {
      form.setFieldsValue(props.initialValues);
    }
  }, [form, props.initialValues]);

  useEffect(() => {
    if (props.loginErrorCount) getGuestQuery.refetch();
  }, [props.loginErrorCount]);

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  // @ts-ignore
  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Form form={form} name="login" layout="vertical" initialValues={props.initialValues}>
        <Row gutter={16} className={style['form-row']}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              rules={[{ required: true, type: 'email', min: 6 }]}
              validateTrigger={['onBlur']}
              label={t('_page:Auth.Login.email')}
            >
              <Input size="large" placeholder={t('_page:Auth.Login.email')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="password"
              rules={[{ required: true, min: 6 }]}
              validateTrigger={['onBlur']}
              label={t('_page:Auth.Login.password')}
            >
              <Input.Password
                size="large"
                placeholder={t('_page:Auth.Login.password')}
                onPressEnter={props.onPressSubmitCallback}
              />
            </Form.Item>
          </Col>

          {getGuestQuery.data?.guest?.captcha && (
            <Col xs={24} sm={12}>
              <Form.Item name="captcha" rules={[{ required: true }]} label={t('_page:Auth.Login.captcha')}>
                <Input
                  size="large"
                  placeholder={t('_page:Auth.Login.captcha')}
                  onPressEnter={props.onPressSubmitCallback}
                  suffix={
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                    <div
                      onClick={() => getGuestQuery.refetch()}
                      className={style['captcha-image']}
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: getGuestQuery.data?.guest?.captcha || '' }}
                    />
                  }
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={16} className={style['remember-row']}>
          <Col xs={24} sm={12}>
            <Form.Item name="rememberPassword">
              <Checkbox checked>{t('_page:Auth.Login.rememberPassword')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
});
