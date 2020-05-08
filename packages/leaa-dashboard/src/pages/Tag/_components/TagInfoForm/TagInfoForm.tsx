import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Tag as TagEntry } from '@leaa/common/src/entrys';
import { errorMessage } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateTagInput } from '@leaa/common/src/dtos/tag';

import { FormCard, EntryInfoDate } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: TagEntry;
  loading?: boolean;
  className?: string;
}

export const TagInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<UpdateTagInput> => {
    try {
      return await form.validateFields();
    } catch (err) {
      return errorMessage(err.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: TagEntry) => {
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
        name: item.name,
        icon: item.icon,
        description: item.description,
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
        title={t('_page:Tag.tagInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="tag-info" layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={6}>
              <Form.Item name="name" rules={[{ required: true }]} label={t('_lang:name')}>
                <Input placeholder={t('_lang:name')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="icon" rules={[]} label={t('_lang:icon')}>
                <Input placeholder={t('_lang:icon')} />
              </Form.Item>
            </Col>

            {props.item && props.item.views && (
              <Col xs={24} sm={4}>
                <Form.Item label={t('_lang:views')}>
                  <Input placeholder={t('_lang:views')} value={props.item.views} disabled />
                </Form.Item>
              </Col>
            )}
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
