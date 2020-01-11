import cx from 'classnames';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row, Checkbox } from 'antd';

import { useTranslation } from 'react-i18next';

import style from './style.module.less';

interface IProps {
  className?: string;
  loading?: boolean;
}

export const LoginForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async () => {
    try {
      return await form.validateFields();
    } catch (error) {
      return false;
    }
  };

  const initialValues = {
    email: 'admin@local.com',
    password: 'h8Hx9qvPKoHMLQgj',
  };

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Form form={form} layout="vertical" initialValues={initialValues}>
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
              <Input.Password size="large" placeholder={t('_page:Auth.Login.password')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} className={style['remember-row']}>
          <Col xs={24} sm={12}>
            <Form.Item name="rememberMe">
              <Checkbox checked>{t('_page:Auth.Login.rememberMe')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
});
