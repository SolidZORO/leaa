import React from 'react';
import cx from 'classnames';
import { Button, Col, Checkbox, Form, Input, Row, message } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { FormComponentProps } from 'antd/lib/form';

import { AuthLoginInput } from '@leaa/common/dtos/auth';
import { LOGIN } from '@leaa/common/graphqls';
import style from './style.less';

interface IProps extends FormComponentProps {
  className?: string;
}

const LoginFormInner = (props: IProps) => {
  const { className, form } = props;
  const { getFieldDecorator } = form;

  const [submitLogin, { loading }] = useMutation<{
    user: AuthLoginInput;
  }>(LOGIN, {
    onError(e) {
      message.error(e.message);
    },
  });

  const onSubmit = async () => {
    form.validateFieldsAndScroll(async (e: Error, formData: AuthLoginInput) => {
      if (e) {
        message.error(e.message);

        return;
      }

      const variables: { user: AuthLoginInput } = {
        user: {
          email: formData.email,
          password: formData.password,
        },
      };

      await submitLogin({ variables });
    });
  };

  return (
    <div className={cx(style['page-wrapper'], className)}>
      <Form>
        <Row gutter={16} className={style['form-row']}>
          <Col xs={24} sm={12}>
            <Form.Item label="Email">
              {getFieldDecorator('email', {
                validateTrigger: ['onBlur'],
                initialValue: 'admin@admin.com',
                rules: [{ required: true }],
              })(<Input size="large" placeholder="Email" />)}
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="Password">
              {getFieldDecorator('password', {
                validateTrigger: ['onBlur'],
                initialValue: 'h8Hx9qvPKoHMLQgj',
                rules: [{ required: true }],
              })(<Input size="large" placeholder="Password" type="password" />)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} className={style['remember-row']}>
          <Col xs={24} sm={12}>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>Remember me</Checkbox>)}
            </Form.Item>
          </Col>
        </Row>

        <Row className={style['button-row']}>
          <Button
            className={style['button-login']}
            loading={loading}
            size="large"
            type="primary"
            htmlType="submit"
            onClick={onSubmit}
          >
            Login
          </Button>

          <Button
            className={style['button-back']}
            size="large"
            // onClick={this.onBack}
          >
            Back
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export const LoginForm = Form.create<IProps>()(LoginFormInner);
