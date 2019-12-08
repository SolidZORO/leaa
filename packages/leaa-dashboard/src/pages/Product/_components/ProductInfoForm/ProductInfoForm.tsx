import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Product } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { FormCard, SwitchNumber, EntryInfoDate, SelectCategoryIdByTree } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Product;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

class ProductInfoFormInner extends React.PureComponent<IProps> {
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
          title={t('_page:Product.Component.productInfo')}
          extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
        >
          <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}>
            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={8}>
                <Form.Item label={t('_page:Product.Component.productName')}>
                  {getFieldDecorator('name', {
                    initialValue: props.item?.name || undefined,
                    rules: [{ required: true }],
                  })(<Input placeholder={t('_lang:name')} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item label={t('_page:Product.Component.productFullname')}>
                  {getFieldDecorator('fullname', {
                    initialValue: props.item?.fullname || undefined,
                    rules: [],
                  })(<Input placeholder={t('_lang:fullname')} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label={t('_lang:serial')}>
                  {getFieldDecorator('serial', {
                    initialValue: props.item?.serial || undefined,
                    rules: [{ required: true }],
                  })(<Input placeholder={t('_lang:serial')} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={2}>
                <Form.Item label={t('_page:Product.Component.putOnSale')}>
                  {getFieldDecorator('status', {
                    initialValue: props.item ? Number(props.item.status) : 1,
                    rules: [{ required: true }],
                  })(<SwitchNumber />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={4}>
                <Form.Item label={t('_page:Product.Component.price')}>
                  {getFieldDecorator('price', {
                    initialValue: props.item?.price || undefined,
                    rules: [{ required: true }],
                  })(<InputNumber placeholder={t('_lang:price')} className={style['input-number']} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={4}>
                <Form.Item label={t('_page:Product.Component.costPrice')}>
                  {getFieldDecorator('cost_price', {
                    initialValue: props.item?.cost_price || undefined,
                    rules: [],
                  })(
                    <InputNumber
                      placeholder={t('_page:Product.Component.costPrice')}
                      className={style['input-number']}
                    />,
                  )}
                </Form.Item>
              </Col>

              <Col xs={24} sm={4}>
                <Form.Item label={t('_page:Product.Component.marketPrice')}>
                  {getFieldDecorator('market_price', {
                    initialValue: props.item?.market_price || undefined,
                    rules: [],
                  })(
                    <InputNumber
                      placeholder={t('_page:Product.Component.marketPrice')}
                      className={style['input-number']}
                    />,
                  )}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label={t('_page:Product.Component.style')}>
                  {getFieldDecorator('styleIds', {
                    initialValue: props.item?.styles?.length ? props.item.styles[0].id : undefined,
                    rules: [{ required: true }],
                    normalize: e => e && Number(e),
                  })(<SelectCategoryIdByTree parentSlug="products" />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label={t('_page:Product.Component.brand')}>
                  {getFieldDecorator('brandIds', {
                    initialValue: props.item?.brands?.length ? props.item.brands[0].id : undefined,
                    rules: [{ required: true }],
                    normalize: e => e && Number(e),
                  })(<SelectCategoryIdByTree parentSlug="brands" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={4}>
                <Form.Item label={t('_lang:stock')}>
                  {getFieldDecorator('stock', {
                    initialValue: props.item?.stock || undefined,
                    rules: [{ required: true }],
                  })(<InputNumber placeholder={t('_lang:stock')} className={style['input-number']} />)}
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
export const ProductInfoForm = withTranslation()(Form.create<IFormProps>()(ProductInfoFormInner));
