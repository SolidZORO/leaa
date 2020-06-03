import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Ax } from '@leaa/common/src/entrys';
import { errorMsg } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { AxUpdateOneReq, AxCreateOneReq } from '@leaa/common/src/dtos/ax';

import { FormCard, EntryInfoDate, SwitchNumber } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Ax;
  className?: string;
  loading?: boolean;
}

export const AxInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<AxCreateOneReq | AxUpdateOneReq> => {
    try {
      return await form.validateFields();
    } catch (err) {
      return errorMsg(err.errorFields[0]?.errors[0]);
    }
  };

  const onRefreshForm = (item?: Ax) => {
    if (!item) return form.setFieldsValue({ status: 0 });

    form.resetFields();
    form.setFieldsValue(item);

    return undefined;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onRefreshForm(props.item), [form, props.item]);
  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={t('_page:Ax.axInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="ax-info" layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={6}>
              <Form.Item name="title" rules={[{ required: true }]} label={t('_lang:title')}>
                <Input placeholder={t('_lang:title')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="slug" rules={[{ required: true }]} label={t('_lang:slug')}>
                <Input placeholder={t('_lang:slug')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={3}>
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

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item name="description" rules={[]} label={t('_lang:description')}>
                <Input.TextArea rows={4} placeholder={t('_lang:description')} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
