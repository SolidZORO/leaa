import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Category } from '@leaa/common/src/entrys';
import { GET_CATEGORY, UPDATE_CATEGORY, GET_CATEGORIES } from '@leaa/common/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import {
  CategoryArgs,
  UpdateCategoryInput,
  CategoriesWithPaginationOrTreeObject,
} from '@leaa/common/src/dtos/category';
import { IPage, IKey } from '@leaa/dashboard/src/interfaces';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { CategoryInfoForm } from '../_components/CategoryInfoForm/CategoryInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const [categoryInfoFormRef, setCategoryInfoFormRef] = useState<any>();

  // query
  const getCategoryVariables = { id: Number(id) };
  const getCategoryQuery = useQuery<{ category: Category }, CategoryArgs>(GET_CATEGORY, {
    variables: getCategoryVariables,
    fetchPolicy: 'network-only',
  });

  const getCategoriesVariables = { page: 1, pageSize: 9999 };
  const getCategoriesQuery = useQuery<{ categories: CategoriesWithPaginationOrTreeObject }, CategoryArgs>(
    GET_CATEGORIES,
    {
      variables: getCategoriesVariables,
      fetchPolicy: 'network-only',
    },
  );

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: number; category: UpdateCategoryInput }>();
  const [updateCategoryMutate, updateCategoryMutation] = useMutation<Category>(UPDATE_CATEGORY, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlCompleted(t('_lang:updatedSuccessfully')),
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
    <PageCard
      title={
        <span>
          <Rcon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
        </span>
      }
      className={style['wapper']}
      loading={getCategoryQuery.loading || updateCategoryMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <CategoryInfoForm
        item={getCategoryQuery.data && getCategoryQuery.data.category}
        categorys={
          getCategoriesQuery.data && getCategoriesQuery.data.categories && getCategoriesQuery.data.categories.items
        }
        loading={getCategoryQuery.loading}
        wrappedComponentRef={(inst: unknown) => setCategoryInfoFormRef(inst)}
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
