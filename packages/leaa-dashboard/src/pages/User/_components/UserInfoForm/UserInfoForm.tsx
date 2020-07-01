import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { RiVipCrown2Line } from 'react-icons/ri';

import { useTranslation } from 'react-i18next';

import { User } from '@leaa/api/src/entrys';
import { errorMsg } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UserUpdateOneReq } from '@leaa/api/src/dtos/user';

import { FormCard, EntryInfoDate, SwitchNumber } from '@leaa/dashboard/src/components';

import { UploadUserAvatar } from '../UploadUserAvatar/UploadUserAvatar';
import style from './style.module.less';

interface IProps {
  item?: User;
  className?: string;
  loading?: boolean;
}

export const UserInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<UserUpdateOneReq> => {
    try {
      return await form.validateFields();
    } catch (err) {
      return errorMsg(err.errorFields[0]?.errors[0]);
    }
  };

  const onRefreshForm = (item?: User) => {
    if (!item) return form.setFieldsValue({ status: 1, is_admin: 0 });

    form.resetFields();
    form.setFieldsValue(item);

    return undefined;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onRefreshForm(props.item), [form, props.item]);
  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['user-info-form-wrapper'], props.className)}>
      <UploadUserAvatar
        item={props.item}
        loading={props.loading}
        onUpdateAvatarCallback={(aurl) => {
          form.setFieldsValue({ avatar_url: aurl });
        }}
      />

      <FormCard
        title={
          <>
            {t('_page:User.userInfo')}{' '}
            {props.item && props.item.is_admin ? <RiVipCrown2Line className={style['is-admin-icon']} /> : null}
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
            <Col xs={24} style={{ display: 'none' }}>
              <Form.Item name="avatar_url">
                <Input placeholder={t('_lang:avatar_url')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={5}>
              <Form.Item name="phone" rules={[{ len: 11 }]} validateTrigger={['onBlur']} label={t('_lang:phone')}>
                <Input placeholder={t('_lang:phone')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={5}>
              <Form.Item name="email" rules={[{ type: 'email' }]} validateTrigger={['onBlur']} label={t('_lang:email')}>
                <Input placeholder={t('_lang:email')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="password" rules={[{ required: !props.item }, { min: 6 }]} label={t('_lang:password')}>
                <Input minLength={6} placeholder={t('_lang:password')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={5}>
              <Form.Item name="name" rules={[{ required: true }]} label={t('_lang:name')}>
                <Input placeholder={t('_lang:name')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={2}>
              <Form.Item
                name="status"
                normalize={(e) => e && Number(e)}
                rules={[{ required: true }]}
                label={t('_lang:status')}
              >
                <SwitchNumber />
              </Form.Item>
            </Col>

            <Col xs={24} sm={3}>
              <Form.Item
                name="is_admin"
                normalize={(e) => e && Number(e)}
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
