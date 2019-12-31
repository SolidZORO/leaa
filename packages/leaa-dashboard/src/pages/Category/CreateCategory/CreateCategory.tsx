import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Category } from '@leaa/common/src/entrys';
import { CreateCategoryInput } from '@leaa/common/src/dtos/category';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { CREATE_CATEGORY } from '@leaa/dashboard/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { CategoryInfoForm } from '../_components/CategoryInfoForm/CategoryInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const infoFormRef = useRef<ICommenFormRef<CreateCategoryInput>>(null);

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
    const infoData: ISubmitData<CreateCategoryInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<CreateCategoryInput> = {
      ...infoData,
    };

    await setSubmitVariables({ category: submitData });
    await createCategoryMutate();
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

      <CategoryInfoForm ref={infoFormRef} />

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
