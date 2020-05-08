import cx from 'classnames';
import queryString from 'query-string';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Category } from '@leaa/common/src/entrys';
import { msgError } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateCategoryInput } from '@leaa/common/src/dtos/category';

import { FormCard, EntryInfoDate, SelectCategoryIdByTree } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Category;
  categorys?: Category[];
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
    return queryString.parse(window.location.search)?.parent_id;
  };

  const onValidateForm = async (): IOnValidateFormResult<UpdateCategoryInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return msgError(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Category) => {
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
        ...item,
        parent_id: getParentId(),
      });
    }

    return undefined;
  };

  useEffect(() => onUpdateForm(props.item), [form, props.item]);
  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={t('_page:Category.categoryInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="category-info" layout="vertical">
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={6}>
              <Form.Item name="parent_id" rules={[{ required: true }]} label={`${t('_lang:parent')} ID`}>
                <SelectCategoryIdByTree initialValues={getParentId()} />
              </Form.Item>
            </Col>

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

          <Row gutter={16} className={style['form-row']}>
            <Col xs={24}>
              <Form.Item name="description" rules={[]} label={t('_lang:description')}>
                <Input.TextArea rows={2} placeholder={t('_lang:description')} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
