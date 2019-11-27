import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, Row } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Permission } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { FormCard, EntryInfoDate } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Permission;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

class PermissionInfoFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard
          title={t('_page:Permission.Component.permissionInfo')}
          extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
        >
          <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}>
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
          </Form>
        </FormCard>
      </div>
    );
  }
}

// @ts-ignore
export const PermissionInfoForm = withTranslation()(Form.create<IFormProps>()(PermissionInfoFormInner));
