import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, Row, Descriptions, Card } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { User } from '@leaa/common/entrys';
import { SwitchNumber } from '@leaa/dashboard/components/SwitchNumber';

import style from './style.less';

interface IProps extends FormComponentProps {
  className?: string;
  item?: User;
  loading?: boolean;
}

class UserInfoFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <Form className={style['form-wrapper']}>
          <Card>
            <Descriptions title="User Info" />

            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={6}>
                <Form.Item label="Email">
                  {getFieldDecorator('email', {
                    initialValue: props.item ? props.item.email : undefined,
                    rules: [{ required: true }, { type: 'email' }],
                  })(<Input placeholder="Email" />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label="Name">
                  {getFieldDecorator('name', {
                    initialValue: props.item ? props.item.name : undefined,
                    rules: [{ required: true }],
                  })(<Input placeholder="Name" />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label="Password">
                  {getFieldDecorator('password', {
                    initialValue: props.item ? props.item.password : undefined,
                  })(<Input placeholder="Password" type="password" />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label="Status">
                  {getFieldDecorator('status', {
                    initialValue: props.item ? Number(props.item.status) : 0,
                    getValueFromEvent: (v: boolean) => Number(v),
                  })(<SwitchNumber />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={6}>
                <Form.Item label="Created At">
                  <Input
                    value={props.item ? `${props.item.created_at}` : undefined}
                    placeholder="Created At"
                    readOnly
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label="Updated At">
                  <Input
                    value={props.item ? `${props.item.updated_at}` : undefined}
                    placeholder="Updated At"
                    readOnly
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    );
  }
}

export const UserInfoForm = Form.create<IProps>()(UserInfoFormInner);
