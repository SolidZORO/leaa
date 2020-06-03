import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Permission } from '@leaa/common/src/entrys';
import { errorMsg } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { PermissionUpdateOneReq } from '@leaa/common/src/dtos/permission';

import { FormCard, EntryInfoDate } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Permission;
  className?: string;
  loading?: boolean;
}

export const PermissionInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<PermissionUpdateOneReq> => {
    try {
      return await form.validateFields();
    } catch (err) {
      return errorMsg(err.errorFields[0]?.errors[0]);
    }
  };

  const onRefreshForm = (item?: Permission) => {
    if (!item) return form.setFieldsValue({ status: 0, is_admin: 0 });

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
        title={t('_page:Permission.permissionInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="permission-info" layout="vertical">
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
