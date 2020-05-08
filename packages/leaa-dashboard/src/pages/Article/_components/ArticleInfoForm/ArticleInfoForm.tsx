import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Input } from 'antd';

import { useTranslation } from 'react-i18next';

import { Article } from '@leaa/common/src/entrys';
import { UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { msgMessage, msgError } from '@leaa/dashboard/src/utils';

import { SwitchNumber, SelectCategoryIdByTree, Rcon } from '@leaa/dashboard/src/components';

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
      return msgError(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Article) => {
    if (!item) return form.setFieldsValue({ status: 0 });

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
        categoryIds: (item?.categories && item.categories[0]?.id) || undefined,
      });
    }

    return undefined;
  };

  useEffect(() => onUpdateForm(props.item), [form, props.item]);

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Form form={form} name="article-info-1" layout="vertical" className={style['form--title-wrapper']}>
        <Form.Item name="title" rules={[{ required: true }]}>
          <Input size="large" placeholder={t('_lang:title')} />
        </Form.Item>
      </Form>

      <Form form={form} name="article-info-2" layout="inline" hideRequiredMark className={style['form--slug-wrapper']}>
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
            rules={[]}
            label={t('_lang:category')}
            colon={false}
            className={style['item--category']}
          >
            <SelectCategoryIdByTree parentSlug="articles" componentProps={{ allowClear: true, size: 'small' }} />
          </Form.Item>

          <Form.Item
            name="status"
            normalize={(e) => e && Number(e)}
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
