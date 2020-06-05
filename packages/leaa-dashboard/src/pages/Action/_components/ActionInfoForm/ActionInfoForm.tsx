import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Row, Col } from 'antd';

import { Action } from '@leaa/api/src/entrys';
import { ActionUpdateOneReq } from '@leaa/api/src/dtos/action';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { errorMsg } from '@leaa/dashboard/src/utils';

import { EntryInfoDate, FormCard } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Action;
  className?: string;
  loading?: boolean;
}

export const ActionInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<ActionUpdateOneReq> => {
    try {
      return await form.validateFields();
    } catch (err) {
      return errorMsg(err.errorFields[0]?.errors[0]);
    }
  };

  const onRefreshForm = (item?: Action) => {
    if (!item) return form.setFieldsValue({});

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
        title={t('_page:Action.actionInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="action-info" layout="vertical">
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={6}>
              <Form.Item name="account" rules={[]} label={t('_lang:account')}>
                <Input placeholder={t('_lang:account')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="module" rules={[]} label={t('_lang:module')}>
                <Input placeholder={t('_lang:module')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="action" label={t('_lang:action')}>
                <Input placeholder={t('_lang:action')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="ip" label={t('_lang:ip')}>
                <Input disabled placeholder={t('_lang:ip')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="user_id" label={t('_lang:user')}>
                <Input disabled placeholder={t('_lang:user_id')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="token" label={t('_lang:token')}>
                <Input disabled placeholder={t('_lang:token')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="updated_at" label={t('_lang:updatedAt')}>
                <Input disabled placeholder={t('_lang:updated_at')} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
