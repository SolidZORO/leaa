import cx from 'classnames';
import qs from 'qs';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Category } from '@leaa/api/src/entrys';
import { errorMsg } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { CategoryUpdateOneReq } from '@leaa/api/src/dtos/category';

import { FormCard, EntryInfoDate, SelectCategoryIdByTree } from '@leaa/dashboard/src/components';
import { FORM_SIZE } from '@leaa/dashboard/src/constants';

import style from './style.module.less';

interface IProps {
  item?: Category;
  loading?: boolean;
  className?: string;
}

export const CategoryInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const getParentId = () => {
    // for Editor
    if (props.item?.parent_id) return props.item.parent_id;

    // for Create
    return qs.parse(window.location.search, { ignoreQueryPrefix: true })?.parent_id;
  };

  const onValidateForm = async (): IOnValidateFormResult<CategoryUpdateOneReq> => {
    try {
      return await form.validateFields();
    } catch (err) {
      return errorMsg(err.errorFields[0]?.errors[0]);
    }
  };

  const onRefreshForm = (item?: Category) => {
    if (!item) return form.setFieldsValue({ parent_id: getParentId() });

    form.resetFields();
    form.setFieldsValue(item);

    return undefined;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onRefreshForm(props.item), [form, props.item]);
  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['category-info-form-wrapper'], props.className)}>
      <FormCard
        title={t('_page:Category.categoryInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="category-info" layout="vertical" size={FORM_SIZE}>
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={8}>
              <Form.Item name="parent_id" label={`${t('_lang:parentCategory')}`}>
                <SelectCategoryIdByTree />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item name="name" rules={[{ required: true }]} label={t('_lang:name')}>
                <Input placeholder={t('_lang:name')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item name="slug" rules={[{ required: true }]} label={t('_lang:slug')}>
                <Input placeholder={t('_lang:slug')} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} className={style['form-row']}>
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
