import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Address } from '@leaa/common/src/entrys';
import { errorMsg } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateAddressInput } from '@leaa/common/src/dtos/address';

import { FormCard, EntryInfoDate, SwitchNumber, AddressSelect } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Address;
  className?: string;
  loading?: boolean;
}

export const AddressInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<UpdateAddressInput> => {
    try {
      return await form.validateFields();
    } catch (err) {
      return errorMsg(err.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Address) => {
    if (!item) return form.setFieldsValue({ status: 1 });

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
        addressSelect: [item.province, item.city, item.area],
      });
    }

    return undefined;
  };

  useEffect(() => onUpdateForm(props.item), [form, props.item]);

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  const onChange = (value: any[]) => {
    form.setFieldsValue({
      province: value[0],
      city: value[1],
      area: value[2],
      addressSelect: value,
    });
  };

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={t('_page:Address.addressInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="address-info" layout="vertical">
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={6}>
              <Form.Item name="consignee" rules={[{ required: true }]} label={t('_page:Address.consignee')}>
                <Input placeholder={t('_page:Address.consignee')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="phone" rules={[{ required: true }]} label={t('_page:Address.phone')}>
                <Input placeholder={t('_page:Address.phone')} type="phone" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={2}>
              <Form.Item
                name="status"
                normalize={(e) => e && Number(e)}
                rules={[{ required: true }]}
                label={t('_lang:status')}
              >
                <SwitchNumber />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} className={style['form-row']}>
            <div style={{ display: 'none' }}>
              <Form.Item name="province" noStyle rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="city" noStyle rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="area" noStyle rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </div>

            <Col xs={24} sm={10}>
              <Form.Item name="addressSelect" rules={[{ required: true }]} label={t('_page:Address.areaLabel')}>
                <AddressSelect
                  onChangeCallback={onChange}
                  initialValues={props.item ? [props.item.province, props.item.city, props.item.area] : undefined}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={14}>
              <Form.Item name="address" rules={[{ required: true }]} label={t('_page:Address.address')}>
                <Input placeholder={t('_page:Address.address')} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
