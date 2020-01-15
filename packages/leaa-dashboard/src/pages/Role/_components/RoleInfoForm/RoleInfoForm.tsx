import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Role } from '@leaa/common/src/entrys';
import { msgUtil } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateRoleInput } from '@leaa/common/src/dtos/role';

import { FormCard, EntryInfoDate } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Role;
  loading?: boolean;
  className?: string;
}

export const RoleInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<UpdateRoleInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return msgUtil.error(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Role) => {
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

  useEffect(() => onUpdateForm(props.item), [form, props.item]);
  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={t('_page:Role.roleInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="role-info" layout="vertical">
          <Row gutter={16}>
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
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
