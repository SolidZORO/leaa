import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row, InputNumber } from 'antd';

import { useTranslation } from 'react-i18next';

import { Zan } from '@leaa/common/src/entrys';
import { messageUtil } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateZanInput } from '@leaa/common/src/dtos/zan';

import { FormCard, EntryInfoDate, SwitchNumber, IdTag } from '@leaa/dashboard/src/components';

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
    if (!item) return form.setFieldsValue({ status: 1, target_zan_quantity: 1 });

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
        target_zan_quantity: item.target_zan_quantity,
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
            <Col xs={24} sm={18}>
              <Form.Item
                name="title"
                rules={[{ required: true }]}
                label={
                  <span>
                    {t('_lang:title')} {props.item && <IdTag id={props.item?.uuid} className={style['uuid-tag']} />}
                  </span>
                }
              >
                <Input placeholder={t('_lang:title')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={3}>
              <Form.Item
                name="target_zan_quantity"
                normalize={e => e && Number(e)}
                rules={[{ required: true }]}
                label={t('_page:Zan.targetZanQuantity')}
              >
                <InputNumber className="g-input-number" placeholder={t('_page:Zan.targetZanQuantity')} />
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
