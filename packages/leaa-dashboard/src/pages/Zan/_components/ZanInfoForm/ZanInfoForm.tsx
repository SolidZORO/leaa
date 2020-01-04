import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Zan } from '@leaa/common/src/entrys';
import { messageUtil } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateZanInput } from '@leaa/common/src/dtos/zan';

import { FormCard, EntryInfoDate, SwitchNumber } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Zan;
  loading?: boolean;
  className?: string;
}

export const ZanInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<UpdateZanInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return messageUtil.error(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Zan) => {
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
        title: item.title,
        status: item.status,
        description: item.description,
      });
    }

    return undefined;
  };

  useEffect(() => onUpdateForm(props.item), [form, props.item]);

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={t('_page:Zan.zanInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={10}>
              <Form.Item label={t('_lang:uuid')}>
                <Input placeholder={t('_lang:uuid')} value={props.item?.uuid} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="title" rules={[{ required: true }]} label={t('_lang:title')}>
                <Input placeholder={t('_lang:title')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
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

          <Row gutter={16} className={style['form-row']}>
            <Col xs={24}>
              <Form.Item name="description" rules={[]} label={t('_lang:description')}>
                <Input.TextArea rows={2} placeholder={t('_lang:description')} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
