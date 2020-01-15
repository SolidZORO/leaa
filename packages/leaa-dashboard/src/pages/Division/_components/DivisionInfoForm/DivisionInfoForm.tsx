import cx from 'classnames';
import queryString from 'query-string';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, InputNumber, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Division } from '@leaa/common/src/entrys';
import { msgUtil } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateDivisionInput } from '@leaa/common/src/dtos/division';

import { FormCard, EntryInfoDate } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Division;
  className?: string;
  loading?: boolean;
}

export const DivisionInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const urlParams = queryString.parse(window.location.search);

  const onValidateForm = async (): IOnValidateFormResult<UpdateDivisionInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return msgUtil.error(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Division) => {
    if (!item)
      return form.setFieldsValue({
        province_code: urlParams.province_code ? Number(urlParams.province_code) : undefined,
        city_code: urlParams.city_code ? Number(urlParams.city_code) : undefined,
      });

    // if APIs return error, do not flush out edited data
    if (form.getFieldValue('updated_at') && !item.updated_at) {
      form.resetFields();
      return undefined;
    }

    // update was successful, keeping the form data and APIs in sync.
    if (form.getFieldValue('updated_at') !== item.updated_at) {
      form.resetFields();
      form.setFieldsValue({
        ...item,
      });
    }

    return undefined;
  };

  useEffect(() => onUpdateForm(props.item), [form, props.item]);

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={t('_page:Division.divisionData')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="division-info" layout="vertical">
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={6}>
              <Form.Item name="name" rules={[{ required: true }]} label={t('_page:Division.name')}>
                <Input placeholder={t('_page:Division.name')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="code" rules={[{ required: true }]} label={t('_page:Division.code')}>
                <InputNumber className="g-input-number" placeholder={t('_page:Division.code')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="province_code" label={t('_page:Division.provinceCode')}>
                <InputNumber className="g-input-number" placeholder={t('_page:Division.provinceCode')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="city_code" label={t('_page:Division.cityCode')}>
                <InputNumber className="g-input-number" placeholder={t('_page:Division.cityCode')} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
