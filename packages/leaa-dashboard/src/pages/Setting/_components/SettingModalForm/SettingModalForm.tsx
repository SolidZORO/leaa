import React from 'react';
import cx from 'classnames';
import { Col, Select, Form, Input, Row, Icon } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Setting } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { buildTypeDom } from '../SettingListForm/SettingListForm';

import style from './style.module.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Setting;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

class SettingInfoFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    const typeMapping: { [key: string]: string } = {
      input: t('_lang:type_input'),
      textarea: t('_lang:type_textarea'),
      radio: t('_lang:type_radio'),
      checkbox: t('_lang:type_checkbox'),
    };

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}>
          {props.item &&
            getFieldDecorator('id', {
              initialValue: props.item ? props.item.id : undefined,
              rules: [{ required: true }],
              normalize: e => e && Number(e),
            })(<Input type="number" placeholder="ID" hidden />)}

          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={6}>
              <Form.Item label={t('_lang:type')}>
                {getFieldDecorator('type', {
                  initialValue: props.item ? props.item.type : undefined,
                  rules: [{ required: true }],
                })(
                  <Select placeholder={t('_lang:type')}>
                    {Object.keys(typeMapping).map((type: string) => (
                      <Select.Option key={type}>{typeMapping[type]}</Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col xs={24} sm={7}>
              <Form.Item label={t('_lang:name')}>
                {getFieldDecorator('name', {
                  initialValue: props.item ? props.item.name : undefined,
                  rules: [{ required: true }],
                })(<Input placeholder={t('_lang:name')} />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={7}>
              <Form.Item label={t('_lang:slug')}>
                {getFieldDecorator('slug', {
                  initialValue: props.item ? props.item.slug : undefined,
                  rules: [{ required: true }],
                })(<Input placeholder={t('_lang:slug')} />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item label={t('_lang:sort')}>
                {getFieldDecorator('sort', {
                  initialValue: props.item ? props.item.sort : 0,
                  rules: [{ required: true }],
                  normalize: e => e && Number(e),
                })(<Input placeholder={t('_lang:sort')} />)}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24}>
              <Form.Item label={t('_lang:value')}>
                {getFieldDecorator('value', {
                  initialValue: props.item ? props.item.value : undefined,
                  rules: [{ required: true }],
                })(
                  buildTypeDom({
                    type: this.props.form.getFieldValue('type'),
                    name: props.item ? props.item.name : '',
                  }),
                )}
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={
                  <span>
                    <Icon type="question-circle" /> {t('_lang:options')}
                  </span>
                }
              >
                {getFieldDecorator('options', {
                  initialValue: props.item ? props.item.options : undefined,
                  rules: [],
                })(<Input.TextArea rows={2} placeholder={t('_lang:options')} />)}
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={
                  <span>
                    <Icon type="question-circle" /> {t('_lang:tips')}
                  </span>
                }
              >
                {getFieldDecorator('description', {
                  initialValue: props.item ? props.item.description : undefined,
                  rules: [],
                })(<Input.TextArea rows={2} placeholder={t('_lang:description')} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

// @ts-ignore
export const SettingModalForm = withTranslation()(Form.create<IFormProps>()(SettingInfoFormInner));
