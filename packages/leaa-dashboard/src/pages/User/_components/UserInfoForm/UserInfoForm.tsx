import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { User } from '@leaa/common/src/entrys';
import { msgUtil } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateUserInput } from '@leaa/common/src/dtos/user';

import { FormCard, EntryInfoDate, SwitchNumber, Rcon } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: User;
  className?: string;
  loading?: boolean;
}

export const UserInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<UpdateUserInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return msgUtil.error(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: User) => {
    if (!item) return form.setFieldsValue({ status: 0, is_admin: 0 });

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
        title={
          <>
            {t('_page:User.userInfo')}{' '}
            {props.item && props.item.is_admin ? (
              <Rcon type="ri-vip-crown-2-line" className={style['is-admin-icon']} />
            ) : null}
          </>
        }
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form
          form={form}
          layout="vertical"
          className={cx(style['form-wrapper'], { [style['form-wrapper--avatar']]: props.item })}
        >
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={6}>
              <Form.Item
                name="email"
                rules={[{ required: true, type: 'email', min: 6 }]}
                validateTrigger={['onBlur']}
                label={t('_lang:email')}
              >
                <Input placeholder={t('_lang:email')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="password" rules={[{ required: !props.item }, { min: 6 }]} label={t('_lang:password')}>
                <Input minLength={6} placeholder={t('_lang:password')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="name" rules={[{ required: true }]} label={t('_lang:name')}>
                <Input placeholder={t('_lang:name')} />
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

            <Col xs={24} sm={3}>
              <Form.Item
                name="is_admin"
                normalize={e => e && Number(e)}
                rules={[{ required: true }]}
                label={t('_lang:admin')}
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
