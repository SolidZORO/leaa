import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Category } from '@leaa/common/src/entrys';
import { CreateCategoryInput } from '@leaa/common/src/dtos/category';
import { IPage, IKey } from '@leaa/dashboard/src/interfaces';
import { CREATE_CATEGORY } from '@leaa/common/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { CategoryInfoForm } from '../_components/CategoryInfoForm/CategoryInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [categoryInfoFormRef, setCategoryInfoFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ category: CreateCategoryInput }>();
  const [createCategoryMutate, createCategoryMutation] = useMutation<{ createCategory: Category }>(CREATE_CATEGORY, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createCategory }) {
      messageUtil.gqlSuccess(t('_lang:createdSuccessfully'));
      props.history.push(`/categories/${createCategory.id}`);
    },
  });

  const onSubmit = async () => {
    categoryInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: CreateCategoryInput) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      await setSubmitVariables({ category: formData });
      await createCategoryMutate();
    });
  };

  return (
    <PageCard
      title={
        <span>
          <Rcon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
        </span>
      }
      className={style['wapper']}
      loading={createCategoryMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <CategoryInfoForm wrappedComponentRef={(inst: unknown) => setCategoryInfoFormRef(inst)} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={CREATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={createCategoryMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
