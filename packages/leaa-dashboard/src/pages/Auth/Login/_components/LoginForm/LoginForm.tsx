import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import { ajax, errorMsg } from '@leaa/dashboard/src/utils';
import { AuthLoginReq } from '@leaa/api/src/dtos/auth';
import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes, IHttpError, ICaptchaResult } from '@leaa/dashboard/src/interfaces';
import { FORM_SIZE } from '@leaa/dashboard/src/constants';

import style from './style.module.less';

interface IProps {
  className?: string;
  loading?: boolean;
  loginErrorCount?: number;
  initialValues?: AuthLoginReq;
  onPressSubmitCallback?: () => void;
}

export const LoginForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [captcha, setCaptcha] = useState<string>();

  const onValidateForm = async () => {
    if (props.loading) return false;

    try {
      return await form.validateFields();
    } catch (err) {
      return false;
    }
  };

  const onFetchCaptcha = async () => {
    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/verification/captcha-for-login`)
      .then((res: IHttpRes<ICaptchaResult>) => {
        setCaptcha(res.data.data.img);
      })
      .catch((err: IHttpError) => {
        errorMsg(err.response?.data?.message || err.message);
      });
  };

  useEffect(() => {
    if (props.initialValues) form.setFieldsValue(props.initialValues);
  }, [form, props.initialValues]);

  useEffect(() => {
    if (props.loginErrorCount) onFetchCaptcha();
  }, [props.loginErrorCount]);

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  // @ts-ignore
  return (
    <div className={cx(style['login-form-wrapper'], props.className)}>
      <Form form={form} name="login" layout="vertical" initialValues={props.initialValues} size={FORM_SIZE}>
        <Row gutter={16} className={style['form-row']}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="account"
              rules={[{ required: true, min: 6 }]}
              validateTrigger={['onBlur']}
              label={t('_page:Auth.Login.account')}
            >
              <Input size="large" placeholder={t('_page:Auth.Login.accountTips')} className={style['form-input']} />
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
                placeholder={t('_page:Auth.Login.password')}
                onPressEnter={props.onPressSubmitCallback}
                className={style['form-input']}
              />
            </Form.Item>
          </Col>

          {captcha && (
            <Col xs={24} sm={12}>
              <Form.Item name="captcha" rules={[{ required: true }]} label={t('_page:Auth.Login.captcha')}>
                <Input
                  placeholder={t('_page:Auth.Login.captcha')}
                  onPressEnter={props.onPressSubmitCallback}
                  suffix={
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                    <div
                      onClick={onFetchCaptcha}
                      className={style['captcha-image']}
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: captcha || '' }}
                    />
                  }
                  className={style['form-input']}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
});
