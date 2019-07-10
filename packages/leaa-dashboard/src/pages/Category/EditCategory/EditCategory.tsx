import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Category } from '@leaa/common/entrys';
import { GET_CATEGORY, UPDATE_CATEGORY } from '@leaa/common/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/constants';
import { CategoryArgs, UpdateCategoryInput } from '@leaa/common/dtos/category';
import { IPage } from '@leaa/dashboard/interfaces';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';

import { CategoryInfoForm } from '../_components/CategoryInfoForm/CategoryInfoForm';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  let categoryInfoFormRef: any;

  const [submitVariables, setSubmitVariables] = useState<{ id: number; category: UpdateCategoryInput }>();

  const getCategoryVariables = { id: Number(id) };
  const getCategoryQuery = useQuery<{ category: Category }, CategoryArgs>(GET_CATEGORY, {
    variables: getCategoryVariables,
  });

  const [updateCategoryMutate, updateCategoryMutation] = useMutation<Category>(UPDATE_CATEGORY, {
    variables: submitVariables,
    onCompleted: () => message.success(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_CATEGORY, variables: getCategoryVariables }],
  });

  const onSubmit = async () => {
    categoryInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Category) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);
        return;
      }

      await setSubmitVariables({ id: Number(id), category: formData });
      await updateCategoryMutate();
    });
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['wapper']} loading={false}>
      {getCategoryQuery.error ? <ErrorCard error={getCategoryQuery.error} /> : null}
      {updateCategoryMutation.error ? <ErrorCard error={updateCategoryMutation.error} /> : null}

      <CategoryInfoForm
        item={getCategoryQuery.data && getCategoryQuery.data.category}
        loading={getCategoryQuery.loading}
        wrappedComponentRef={(inst: unknown) => {
          categoryInfoFormRef = inst;
        }}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          loading={updateCategoryMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
