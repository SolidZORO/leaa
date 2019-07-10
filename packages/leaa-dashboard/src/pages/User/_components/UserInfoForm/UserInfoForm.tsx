import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, Row, Descriptions, Card, DatePicker } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { User } from '@leaa/common/entrys';
import { SwitchNumber } from '@leaa/dashboard/components/SwitchNumber';
import { ITfn } from '@leaa/dashboard/interfaces';

import style from './style.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: User;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

class UserInfoFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <Form className={style['form-wrapper']}>
          <Card>
            <Descriptions title={t('_page:User.Component.userInfo')} />

            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={6}>
                <Form.Item label={t('_lang:email')}>
                  {getFieldDecorator('email', {
                    initialValue: props.item ? props.item.email : undefined,
                    rules: [{ required: true }, { type: 'email' }],
                  })(<Input placeholder={t('_lang:email')} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label={t('_lang:name')}>
                  {getFieldDecorator('name', {
                    initialValue: props.item ? props.item.name : undefined,
                    rules: [],
                  })(<Input placeholder={t('_lang:name')} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label={t('_lang:password')}>
                  {getFieldDecorator('password', {
                    initialValue: props.item ? props.item.password : undefined,
                    rules: [{ required: !props.item }, { min: 6 }],
                  })(<Input placeholder={t('_lang:password')} type="password" minLength={6} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label={t('_lang:status')}>
                  {getFieldDecorator('status', {
                    initialValue: props.item ? Number(props.item.status) : 0,
                    getValueFromEvent: (v: boolean) => Number(v),
                  })(<SwitchNumber />)}
                </Form.Item>
              </Col>
            </Row>

            {props.item && (
              <Row gutter={16} className={style['form-row']}>
                <Col xs={24} sm={6}>
                  <Form.Item label={t('_lang:createdAt')}>
                    <Input
                      value={props.item ? `${props.item.createdAt}` : undefined}
                      placeholder={t('_lang:createdAt')}
                      readOnly
                      disabled
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item label={t('_lang:updatedAt')}>
                    <Input
                      value={props.item ? `${props.item.updatedAt}` : undefined}
                      placeholder={t('_lang:updatedAt')}
                      readOnly
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Card>
        </Form>
      </div>
    );
  }
}

// @ts-ignore
export const UserInfoForm = withTranslation()(Form.create<IFormProps>()(UserInfoFormInner));
