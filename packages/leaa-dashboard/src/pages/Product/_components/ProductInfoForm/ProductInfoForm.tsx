import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, InputNumber, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Product } from '@leaa/common/src/entrys';
import { messageUtil } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateProductInput } from '@leaa/common/src/dtos/product';

import {
  FormCard,
  SwitchNumber,
  EntryInfoDate,
  SelectCategoryIdByTree,
  PriceInput,
} from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Product;
  className?: string;
  loading?: boolean;
}

export const ProductInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<UpdateProductInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return messageUtil.error(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Product) => {
    if (!item) return form.setFieldsValue({ status: 0 });

    // if APIs return error, do not flush out edited data
    if (form.getFieldValue('updated_at') && !item.updated_at) return undefined;

    // update was successful, keeping the form data and APIs in sync.
    if (form.getFieldValue('updated_at') !== item.updated_at) {
      form.setFieldsValue({
        ...item,
        styleIds: item?.styles?.length ? item.styles[0].id : undefined,
        brandIds: item?.brands?.length ? item.brands[0].id : undefined,
      });
    }

    return undefined;
  };

  useEffect(() => onUpdateForm(props.item), [form, props.item]);

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={t('_page:Product.productInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={8}>
              <Form.Item name="name" rules={[{ required: true }]} label={t('_page:Product.productName')}>
                <Input placeholder={t('_page:Product.productName')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item name="fullname" rules={[{ required: true }]} label={t('_page:Product.productFullname')}>
                <Input placeholder={t('_lang:fullname')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="serial" rules={[{ required: true }]} label={t('_lang:serial')}>
                <Input placeholder={t('_lang:serial')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={2}>
              <Form.Item
                name="status"
                normalize={e => e && Number(e)}
                rules={[{ required: true }]}
                label={t('_page:Product.putOnSale')}
              >
                <SwitchNumber />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={4}>
              <Form.Item name="price" rules={[{ required: true }]} label={t('_page:Product.price')}>
                <PriceInput className="g-input-number" placeholder={t('_lang:price')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="cost_price" rules={[]} label={t('_page:Product.costPrice')}>
                <PriceInput className="g-input-number" placeholder={t('_page:Product.costPrice')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="market_price" rules={[]} label={t('_page:Product.marketPrice')}>
                <PriceInput className="g-input-number" placeholder={t('_page:Product.marketPrice')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item
                name="styleIds"
                normalize={e => e && Number(e)}
                rules={[{ required: true }]}
                label={t('_page:Product.style')}
              >
                <SelectCategoryIdByTree parentSlug="products" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item
                name="brandIds"
                normalize={e => e && Number(e)}
                rules={[{ required: true }]}
                label={t('_page:Product.brand')}
              >
                <SelectCategoryIdByTree parentSlug="brands" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={4}>
              <Form.Item name="stock" rules={[{ required: true }]} label={t('_lang:stock')}>
                <InputNumber className="g-input-number" placeholder={t('_lang:stock')} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
