import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, Row } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Tag } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { FormCard, EntryInfoDate } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Tag;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

class TagInfoFormInner extends React.PureComponent<IProps> {
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
          title={t('_page:Tag.Component.tagInfo')}
          extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
        >
          <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}>
            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={10}>
                <Form.Item label={t('_lang:name')}>
                  {getFieldDecorator('name', {
                    initialValue: props.item ? props.item.name : undefined,
                    rules: [{ required: true, max: 30 }],
                  })(<Input placeholder={t('_lang:name')} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={10}>
                <Form.Item label={t('_lang:icon')}>
                  {getFieldDecorator('icon', {
                    initialValue: props.item ? props.item.icon : undefined,
                    rules: [],
                  })(<Input placeholder={t('_lang:icon')} />)}
                </Form.Item>
              </Col>

              {props.item && props.item.icon && (
                <Col xs={24} sm={4}>
                  <Form.Item label={t('_page:Tag.Component.count')}>
                    <Input placeholder={t('_lang:count')} value={props.item.count} disabled />
                  </Form.Item>
                </Col>
              )}

              <Col xs={24}>
                <Form.Item label={t('_lang:description')}>
                  {getFieldDecorator('description', {
                    initialValue: props.item ? props.item.description : undefined,
                    rules: [],
                  })(<Input.TextArea rows={4} placeholder={t('_lang:description')} />)}
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
export const TagInfoForm = withTranslation()(Form.create<IFormProps>()(TagInfoFormInner));
