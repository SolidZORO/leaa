import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, InputNumber, Row, DatePicker } from 'antd';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { FormComponentProps } from 'antd/lib/form';

import { Promo } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { FormCard, SwitchNumber, IdTag } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Promo;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;
const curremtTime = moment();

class PromoInfoFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard title={t('_page:Promo.Component.promoInfo')}>
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

              <Col xs={24} sm={3}>
                <Form.Item label={t('_page:Promo.Component.amount')}>
                  {getFieldDecorator('amount', {
                    initialValue: props.item ? props.item.amount : 0,
                    rules: [{ required: true }],
                  })(<InputNumber placeholder={t('_lang:amount')} className={style['input-number']} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item label={t('_page:Promo.Component.overAmount')}>
                  {getFieldDecorator('over_amount', {
                    initialValue: props.item ? props.item.over_amount : 0,
                    rules: [{ required: true }],
                  })(<InputNumber placeholder={t('_lang:over_amount')} className={style['input-number']} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item label={t('_lang:status')}>
                  {getFieldDecorator('status', {
                    initialValue: props.item ? Number(props.item.status) : 1,
                    rules: [{ required: true }],
                  })(<SwitchNumber />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item label={t('_lang:quantity')}>
                  {getFieldDecorator('quantity', {
                    initialValue:
                      props.item && typeof props.item.quantity !== 'undefined' ? Number(props.item.quantity) : 1,
                    rules: [{ required: true }],
                  })(<InputNumber placeholder={t('_lang:quantity')} className={style['input-number']} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item label={t('_page:Promo.Component.redeemedQuantity')}>
                  {getFieldDecorator('redeemed_quantity', {
                    initialValue:
                      props.item && typeof props.item.redeemed_quantity !== 'undefined'
                        ? Number(props.item.redeemed_quantity)
                        : 0,
                    rules: [{ required: true }],
                  })(<InputNumber placeholder={t('_lang:quantity')} className={style['input-number']} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={6}>
                <Form.Item label={t('_page:Promo.Component.startTime')}>
                  {getFieldDecorator('start_time', {
                    initialValue: props.item && props.item.start_time ? moment(props.item.start_time) : curremtTime,
                    rules: [{ required: true }],
                  })(<DatePicker showTime />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={4}>
                <Form.Item label={t('_page:Promo.Component.expireTime')}>
                  {getFieldDecorator('expire_time', {
                    initialValue:
                      props.item && props.item.expire_time
                        ? moment(props.item.expire_time)
                        : moment(curremtTime).add(3, 'day'),
                    rules: [{ required: true }],
                  })(<DatePicker showTime />)}
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
export const PromoInfoForm = withTranslation()(Form.create<IFormProps>()(PromoInfoFormInner));
