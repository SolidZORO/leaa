import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Article } from '@leaa/common/src/entrys';
import { CreateArticleInput } from '@leaa/common/src/dtos/article';
import { IPage, ISubmitData, ICommenFormRef } from '@leaa/dashboard/src/interfaces';
import { CREATE_ARTICLE } from '@leaa/dashboard/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { msgMessage } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { ArticleInfoForm } from '../_components/ArticleInfoForm/ArticleInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const infoFormRef = useRef<ICommenFormRef<CreateArticleInput>>(null);

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ article: CreateArticleInput }>();
  const [createArticleMutate, createArticleMutation] = useMutation<{ createArticle: Article }>(CREATE_ARTICLE, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createArticle }) {
      msgMessage(t('_lang:createdSuccessfully'));
      props.history.push(`/articles/${createArticle.id}`);
    },
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<CreateArticleInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<CreateArticleInput> = infoData;

    await setSubmitVariables({ article: submitData });
    await createArticleMutate();
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
      loading={createArticleMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <ArticleInfoForm ref={infoFormRef} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={CREATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={createArticleMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
