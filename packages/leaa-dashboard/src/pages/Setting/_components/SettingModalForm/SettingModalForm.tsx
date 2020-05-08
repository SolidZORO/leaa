import cx from 'classnames';
import React, { useEffect, forwardRef, useState, useImperativeHandle } from 'react';
import { Col, Form, Input, Row, Select, InputNumber } from 'antd';

import { useTranslation } from 'react-i18next';

import { Setting } from '@leaa/common/src/entrys';
import { msgMessage, msgError } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateSettingInput } from '@leaa/common/src/dtos/setting';

import { SwitchNumber, Rcon } from '@leaa/dashboard/src/components';
import { buildTypeDom } from '../SettingListForm/SettingListForm';

import style from './style.module.less';

interface IProps {
  type: 'create' | 'update' | null;
  item?: Setting;
  loading?: boolean;
  className?: string;
}

export const SettingModalForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [optionType, setOptionType] = useState(props.item?.type || 'input');

  const typeMapping: { [key: string]: string } = {
    input: t('_lang:type_input'),
    textarea: t('_lang:type_textarea'),
    radio: t('_lang:type_radio'),
    // checkbox: t('_lang:type_checkbox'),
  };

  const onValidateForm = async (): IOnValidateFormResult<UpdateSettingInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return msgError(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Setting) => {
    if (props.type === 'create') {
      return form.setFieldsValue({
        private: 0,
        sort: 0,
      });
    }

    if (!item) return undefined;

    // if APIs return error, do not flush out edited data
    if (form.getFieldValue('updated_at') && !item.updated_at) {
      form.resetFields();
      return undefined;
    }

    // update was successful, keeping the form data and APIs in sync.
    if (form.getFieldValue('updated_at') !== item.updated_at) {
      form.resetFields();
      form.setFieldsValue(item);
    }

    return undefined;
  };

  const onChangeOptionType = (v: string) => {
    setOptionType(v);

    form.setFieldsValue({
      type: v,
    });
  };

  useEffect(() => onUpdateForm(props.item), [form, props.item]);
  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Form form={form} name="setting-modal" layout="vertical">
        <Row gutter={16}>
          {props.type !== 'create' && (
            <div style={{ display: 'none' }}>
              <Form.Item name="id" noStyle rules={[{ required: true }]} label={t('_lang:id')}>
                <Input placeholder={t('_lang:id')} />
              </Form.Item>
            </div>
          )}

          <Col xs={24} sm={9}>
            <Form.Item name="name" rules={[{ required: true }]} label={t('_lang:name')}>
              <Input placeholder={t('_lang:name')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={9}>
            <Form.Item name="slug" rules={[{ required: true }]} label={t('_lang:slug')}>
              <Input placeholder={t('_lang:slug')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item name="type" rules={[{ required: true }]} label={t('_lang:type')}>
              <Select placeholder={t('_lang:type')} onChange={onChangeOptionType}>
                {Object.keys(typeMapping).map((type: string) => (
                  <Select.Option key={type} value={type}>
                    {typeMapping[type]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item name="value" rules={[{ required: true }]} label={t('_lang:value')}>
              {buildTypeDom({
                type: optionType,
                name: props.item ? props.item.name : '',
              })}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={6}>
            <Form.Item
              name="sort"
              normalize={(e) => e && Number(e)}
              rules={[{ required: true }]}
              label={t('_lang:sort')}
            >
              <InputNumber className="g-input-number" placeholder={t('_lang:sort')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              name="private"
              normalize={(e) => e && Number(e)}
              rules={[{ required: true }]}
              label={t('_lang:private')}
            >
              <SwitchNumber />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="options"
              rules={[]}
              label={
                <span>
                  {t('_page:Setting.options')} <small>({t('_page:Setting.optionsTips')})</small>
                </span>
              }
            >
              <Input.TextArea rows={3} placeholder={t('_page:Setting.optionsTips')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="description"
              rules={[]}
              label={
                <span>
                  <Rcon type="ri-question-line" /> {t('_lang:tips')}
                </span>
              }
            >
              <Input.TextArea rows={3} placeholder={t('_lang:description')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
});
