import cx from 'classnames';
import React, { useEffect, forwardRef, useState, useImperativeHandle } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';

import { useTranslation } from 'react-i18next';

import { Setting } from '@leaa/common/src/entrys';
import { messageUtil } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateSettingInput } from '@leaa/common/src/dtos/setting';

import { FormCard, EntryInfoDate, SwitchNumber, Rcon } from '@leaa/dashboard/src/components';
import { buildTypeDom } from '../SettingListForm/SettingListForm';

import style from './style.module.less';

interface IProps {
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
    checkbox: t('_lang:type_checkbox'),
  };

  const onValidateForm = async (): IOnValidateFormResult<UpdateSettingInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return messageUtil.error(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Setting) => {
    if (!item) return undefined;

    return form.setFieldsValue(item);
  };

  useEffect(() => onUpdateForm(props.item), [form, props.item]);
  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  console.log(optionType);

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={t('_page:Setting.settingInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={6}>
              <Form.Item name="id" rules={[{ required: true }]} normalize={e => e && Number(e)} label={t('_lang:id')}>
                <Input placeholder={t('_lang:id')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="name" rules={[{ required: true }]} label={t('_lang:name')}>
                <Input placeholder={t('_lang:name')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="slug" rules={[{ required: true }]} label={t('_lang:slug')}>
                <Input placeholder={t('_lang:slug')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="type" rules={[{ required: true }]} label={t('_lang:type')}>
                <Select placeholder={t('_lang:type')} onChange={v => setOptionType(v as string)}>
                  {Object.keys(typeMapping).map((type: string) => (
                    <Select.Option key={type} value={type}>
                      {typeMapping[type]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
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
                normalize={e => e && Number(e)}
                rules={[{ required: true }]}
                label={t('_lang:sort')}
              >
                <Input placeholder={t('_lang:sort')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item
                name="private"
                normalize={e => e && Number(e)}
                rules={[{ required: true }]}
                label={t('_lang:private')}
              >
                <SwitchNumber />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={6}>
              <Form.Item name="options" rules={[]} label={t('_lang:options')}>
                <Input.TextArea rows={3} placeholder={t('_lang:options')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item
                name="description"
                rules={[]}
                label={
                  <span>
                    <Rcon type="question-circle" /> {t('_lang:tips')}
                  </span>
                }
              >
                <Input.TextArea rows={3} placeholder={t('_lang:description')} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
