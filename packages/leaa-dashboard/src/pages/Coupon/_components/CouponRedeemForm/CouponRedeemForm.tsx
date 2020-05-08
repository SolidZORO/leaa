import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, Row } from 'antd';

import { Coupon } from '@leaa/common/src/entrys';
import { msgMessage, msgError } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateCouponInput } from '@leaa/common/src/dtos/coupon';

import { FormCard, EntryInfoDate } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Coupon;
  loading?: boolean;
  className?: string;
  submitButton?: any;
}

export const CouponRedeemForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<UpdateCouponInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return msgError(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Coupon) => {
    if (!item) return undefined;

    // if APIs return error, do not flush out edited data
    if (form.getFieldValue('updated_at') && !item.updated_at) {
      form.resetFields();
      return undefined;
    }

    // update was successful, keeping the form data and APIs in sync.
    if (form.getFieldValue('updated_at') !== item.updated_at) {
      form.resetFields();
      form.setFieldsValue({
        ...item,
      });
    }

    return undefined;
  };

  useEffect(() => {
    onUpdateForm(props.item);
  }, [props.item]);

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={`${t('_page:Coupon.couponInfo')} TEST`}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="coupon-redeem" layout="vertical">
          <Row gutter={16}>
            <div style={{ display: 'none' }}>
              <Form.Item name="code" noStyle rules={[{ required: true }]} label={t('_page:Coupon.code')}>
                <Input placeholder={t('_page:Coupon.code')} />
              </Form.Item>
            </div>

            <Col xs={24} sm={6}>
              <Form.Item name="userId" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            {props.submitButton && (
              <Col xs={24} sm={4}>
                <Form.Item>{props.submitButton}</Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
