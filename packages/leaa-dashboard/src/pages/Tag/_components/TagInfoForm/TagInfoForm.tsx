import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Tag as TagEntry } from '@leaa/api/src/entrys';
import { errorMsg } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { TagUpdateOneReq } from '@leaa/api/src/dtos/tag';

import { FormCard, EntryInfoDate } from '@leaa/dashboard/src/components';
import { FORM_SIZE } from '@leaa/dashboard/src/constants';

import style from './style.module.less';

interface IProps {
  item?: TagEntry;
  loading?: boolean;
  className?: string;
}

export const TagInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<TagUpdateOneReq> => {
    try {
      return await form.validateFields();
    } catch (err) {
      return errorMsg(err.errorFields[0]?.errors[0]);
    }
  };

  const onRefreshForm = (item?: TagEntry) => {
    if (!item) return form.setFieldsValue({ status: 0 });

    form.resetFields();
    form.setFieldsValue(item);

    return undefined;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onRefreshForm(props.item), [form, props.item]);
  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['tag-info-form-wrapper'], props.className)}>
      <FormCard
        title={t('_page:Tag.tagInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="tag-info" layout="vertical" size={FORM_SIZE}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="name" rules={[{ required: true }]} label={t('_lang:name')}>
                <Input placeholder={t('_lang:name')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="icon" rules={[]} label={t('_lang:icon')}>
                <Input placeholder={t('_lang:icon')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item label={t('_lang:views')}>
                <Input placeholder={t('_lang:views')} value={props.item?.views} disabled />
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
