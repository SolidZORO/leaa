import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, Row, Descriptions, Card } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Role } from '@leaa/common/entrys';
import { ITfn } from '@leaa/dashboard/interfaces';

import style from './style.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Role;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

class RoleInfoFormInner extends React.PureComponent<IProps> {
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
            <Descriptions title={t('_page:Role.Component.roleInfo')} />

            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={6}>
                <Form.Item label={t('_lang:name')}>
                  {getFieldDecorator('name', {
                    initialValue: props.item ? props.item.name : undefined,
                    rules: [{ required: true }],
                  })(<Input placeholder={t('_lang:name')} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label={t('_lang:slug')}>
                  {getFieldDecorator('slug', {
                    initialValue: props.item ? props.item.slug : undefined,
                    rules: [{ required: true }],
                  })(<Input placeholder={t('_lang:slug')} />)}
                </Form.Item>
              </Col>
            </Row>

            {props.item && (
              <Row gutter={16} className={style['form-row']}>
                <Col xs={24} sm={6}>
                  <Form.Item label={t('_lang:createdAt')}>
                    <Input
                      value={props.item ? `${props.item.created_at}` : undefined}
                      placeholder={t('_lang:createdAt')}
                      readOnly
                      disabled
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item label={t('_lang:updatedAt')}>
                    <Input
                      value={props.item ? `${props.item.updated_at}` : undefined}
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
export const PermissionInfoForm = withTranslation()(Form.create<IFormProps>()(RoleInfoFormInner));
