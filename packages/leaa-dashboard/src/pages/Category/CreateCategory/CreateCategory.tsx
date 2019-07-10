import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Category } from '@leaa/common/entrys';
import { UpdateCategoryInput } from '@leaa/common/dtos/category';
import { IPage } from '@leaa/dashboard/interfaces';
import { CREATE_CATEGORY } from '@leaa/common/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/constants';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';

import { CategoryInfoForm } from '../_components/CategoryInfoForm/CategoryInfoForm';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  let categoryInfoFormRef: any;

  const [submitVariables, setSubmitVariables] = useState<{ category: UpdateCategoryInput }>();

  const [createCategoryMutate, createCategoryMutation] = useMutation<{ createCategory: Category }>(CREATE_CATEGORY, {
    variables: submitVariables,
    onError(e) {
      message.error(e.message);
    },
    onCompleted({ createCategory }) {
      message.success(t('_lang:createdSuccessfully'));
      props.history.push(`/categories/${createCategory.id}`);
    },
  });

  const onSubmit = async () => {
    categoryInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Category) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);
        return;
      }

      await setSubmitVariables({ category: formData });
      await createCategoryMutate();
    });
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['wapper']} loading={false}>
      {createCategoryMutation.error ? <ErrorCard error={createCategoryMutation.error} /> : null}

      <CategoryInfoForm
        wrappedComponentRef={(inst: unknown) => {
          categoryInfoFormRef = inst;
        }}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={CREATE_BUTTON_ICON}
          className="submit-button"
          loading={createCategoryMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
