import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Category } from '@leaa/common/src/entrys';
import { GET_CATEGORY, UPDATE_CATEGORY, GET_CATEGORIES } from '@leaa/dashboard/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import {
  CategoryArgs,
  UpdateCategoryInput,
  CategoriesWithPaginationOrTreeObject,
} from '@leaa/common/src/dtos/category';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msg } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { CategoryInfoForm } from '../_components/CategoryInfoForm/CategoryInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdateCategoryInput>>(null);

  // ref
  // const [categoryInfoFormRef, setCategoryInfoFormRef] = useState<any>();

  // query
  const getCategoryVariables = { id };
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
  const [submitVariables, setSubmitVariables] = useState<{ id: string; category: UpdateCategoryInput }>();
  const [updateCategoryMutate, updateCategoryMutation] = useMutation<Category>(UPDATE_CATEGORY, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msg(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_CATEGORY, variables: getCategoryVariables }],
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<UpdateCategoryInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<UpdateCategoryInput> = {
      ...infoData,
    };

    await setSubmitVariables({ id, category: submitData });
    await updateCategoryMutate();
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
        ref={infoFormRef}
        item={getCategoryQuery.data?.category}
        categorys={getCategoriesQuery.data?.categories?.items}
        loading={getCategoryQuery.loading}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={updateCategoryMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
