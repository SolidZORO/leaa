import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, InputNumber, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Article } from '@leaa/common/src/entrys';
import { UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { FormCard, SwitchNumber, EntryInfoDate, SelectCategoryIdByTree, Rcon } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Article;
  className?: string;
  loading?: boolean;
}

export const ArticleInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<UpdateArticleInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return messageUtil.error(error.errorFields[0]?.errors[0]);
    }
  };

  const formatInitialValues = (item?: Article): Article | {} => {
    // create
    if (!item) {
      return {
        status: 0,
      };
    }

    // edit
    return {
      ...item,
    };
  };

  useEffect(() => {
    if (props.item) form.setFieldsValue(formatInitialValues(props.item));
  }, [props.item]);

  useImperativeHandle(ref, () => ({
    form,
    onValidateForm,
  }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Form
        form={form}
        name="infoForm"
        layout="vertical"
        initialValues={formatInitialValues(props.item)}
        className={style['form--title-wrapper']}
      >
        <Form.Item name="title" rules={[{ required: true }]}>
          <Input size="large" placeholder={t('_lang:title')} />
        </Form.Item>
      </Form>

      <Form
        form={form}
        name="infoForm"
        layout="inline"
        initialValues={formatInitialValues(props.item)}
        hideRequiredMark
        className={style['form--slug-wrapper']}
      >
        <div className={style['block--slug']}>
          <Form.Item name="slug" rules={[]} className={style['item--slug']}>
            <Input
              size="small"
              className={style['form-item-slug-input']}
              prefix={<Rcon type="ri-link-m" />}
              placeholder={t('_lang:slug')}
            />
          </Form.Item>
        </div>

        <div className={style['block--category-and-status']}>
          <Form.Item
            name="categoryIds"
            normalize={e => e && Number(e)}
            rules={[]}
            label={t('_lang:category')}
            colon={false}
            className={style['item--category']}
          >
            <SelectCategoryIdByTree parentSlug="articles" componentProps={{ allowClear: true, size: 'small' }} />
          </Form.Item>

          <Form.Item
            name="status"
            normalize={e => e && Number(e)}
            rules={[{ required: true }]}
            label={t('_lang:status')}
            colon={false}
            className={style['item--status']}
          >
            <SwitchNumber size="small" />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
});
