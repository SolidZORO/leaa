import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row, Cascader } from 'antd';

import { useTranslation } from 'react-i18next';

import { Address } from '@leaa/common/src/entrys';
import { messageUtil } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateAddressInput } from '@leaa/common/src/dtos/address';

import { FormCard, EntryInfoDate, SwitchNumber, Rcon } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Address;
  className?: string;
  loading?: boolean;
}

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

export const DivisionInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<UpdateAddressInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return messageUtil.error(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Address) => {
    if (!item) return form.setFieldsValue({ status: 0 });

    // if APIs return error, do not flush out edited data
    if (form.getFieldValue('updated_at') && !item.updated_at) return undefined;

    // update was successful, keeping the form data and APIs in sync.
    if (form.getFieldValue('updated_at') !== item.updated_at) {
      form.setFieldsValue({
        ...item,
        addressx: ['jiangsu', 'nanjing', 'zhonghuamen'],
      });
    }

    return undefined;
  };

  useEffect(() => onUpdateForm(props.item), [form, props.item]);

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  const onChange = (value: any) => {
    console.log(value);
  };

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={t('_page:Address.addressInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={6}>
              <Form.Item name="address" rules={[{ required: true }]} label={t('_page:Address.address')}>
                <Input placeholder={t('_lang:address')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="addressx" rules={[{ required: true }]} label={t('_page:Address.address')}>
                <Cascader options={options} onChange={onChange} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={3}>
              <Form.Item
                name="status"
                normalize={e => e && Number(e)}
                rules={[{ required: true }]}
                label={t('_lang:status')}
              >
                <SwitchNumber />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
