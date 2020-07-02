import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input } from 'antd';
import { RiExternalLinkLine } from 'react-icons/ri';

import { Article } from '@leaa/api/src/entrys';
import { ArticleUpdateOneReq } from '@leaa/api/src/dtos/article';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { errorMsg } from '@leaa/dashboard/src/utils';

import { SwitchNumber, SelectCategoryIdByTree } from '@leaa/dashboard/src/components';
import { FORM_SIZE } from '@leaa/dashboard/src/constants';

import style from './style.module.less';

interface IProps {
  item?: Article;
  className?: string;
  loading?: boolean;
}

/**
 * 关于 categoryIds 为 empty 的处理方式
 *
 * @ideaNotes
 * categoryIds 如果没有值，请设置为 null，以强表示为清空，API 看到这个值会做清空处理，
 * 如果为 '' 字符或 undefined，API 都不会做处理，因为意图不够明确。
 *
 * 所以有两个地方需要注意，
 * - Input  | `setFieldsValue`，
 * - Output | Form.Item `normalize={(e) => e || null}`
 */
export const ArticleInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<ArticleUpdateOneReq> => {
    try {
      return await form.validateFields();
    } catch (err) {
      return errorMsg(err.errorFields[0]?.errors[0]);
    }
  };

  const onRefreshForm = (item?: Article) => {
    if (!item) return form.setFieldsValue({ status: 0 });

    form.resetFields();
    form.setFieldsValue({
      ...item,
      categoryIds: (item?.categories && item.categories[0]?.id) || null,
    });

    return undefined;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onRefreshForm(props.item), [form, props.item]);
  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['article-info-form-wrapper'], props.className)}>
      <Form form={form} name="article-info" layout="vertical" className={style['form--title-wrapper']} size={FORM_SIZE}>
        <Form.Item name="title" rules={[{ required: true }]}>
          <Input placeholder={t('_lang:title')} />
        </Form.Item>
      </Form>

      <Form
        form={form}
        name="article-info-2"
        layout="inline"
        hideRequiredMark
        className={style['form--slug-wrapper']}
        size={FORM_SIZE}
      >
        <div className={style['block--slug']}>
          <Form.Item name="slug" rules={[]} className={style['item--slug']}>
            <Input
              className={style['form-item-slug-input']}
              prefix={<RiExternalLinkLine type="ri-link-m" />}
              placeholder={t('_lang:slug')}
            />
          </Form.Item>
        </div>

        <div className={style['block--category-and-status']}>
          <Form.Item
            name="categoryIds"
            normalize={(e) => e || null}
            rules={[]}
            label={t('_lang:category')}
            colon={false}
            className={style['item--category']}
          >
            <SelectCategoryIdByTree parentSlug="articles" componentProps={{ allowClear: true }} dropdownWidth={200} />
          </Form.Item>

          <Form.Item
            name="status"
            normalize={(e) => e && Number(e)}
            rules={[{ required: true }]}
            label={t('_lang:status')}
            colon={false}
            className={style['item--status']}
          >
            <SwitchNumber />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
});
