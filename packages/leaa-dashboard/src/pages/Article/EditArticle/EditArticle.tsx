import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { BraftEditorProps } from 'braft-editor';

import { Article } from '@leaa/common/entrys';
import { GET_ARTICLE, UPDATE_ARTICLE } from '@leaa/common/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/constants';
import { ArticleArgs, UpdateArticleInput } from '@leaa/common/dtos/article';
import { IPage } from '@leaa/dashboard/interfaces';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';

import { ArticleInfoForm } from '../_components/ArticleInfoForm/ArticleInfoForm';
import { ArticleExtForm } from '../_components/ArticleExtForm/ArticleExtForm';
import { ArticleContentForm } from '../_components/ArticleContentForm/ArticleContentForm';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  let articleInfoFormRef: any;
  let articleExtFormRef: any;

  const articleCententForm = React.createRef<{ props: BraftEditorProps } | null>();

  const [submitVariables, setSubmitVariables] = useState<{ id: number; article: UpdateArticleInput }>();

  const getArticleVariables = { id: Number(id) };
  const getArticleQuery = useQuery<{ article: Article }, ArticleArgs>(GET_ARTICLE, {
    variables: getArticleVariables,
  });

  const [updateArticleMutate, updateArticleMutation] = useMutation<Article>(UPDATE_ARTICLE, {
    variables: submitVariables,
    onCompleted: () => message.success(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_ARTICLE, variables: getArticleVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateArticleInput = {};

    articleInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Article) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);
      }

      submitData = formData;
    });

    if (hasError) {
      return;
    }

    articleExtFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Article) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);
      }

      submitData = {
        ...submitData,
        ...formData,
      };
    });

    if (hasError) {
      return;
    }

    if (
      articleCententForm &&
      articleCententForm.current &&
      articleCententForm.current.props &&
      articleCententForm.current.props.value &&
      typeof articleCententForm.current.props.value.toHTML() !== 'undefined'
    ) {
      submitData.content = articleCententForm.current.props.value.toHTML();
    }

    await setSubmitVariables({ id: Number(id), article: submitData });
    await updateArticleMutate();
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['wapper']} loading={false}>
      {getArticleQuery.error ? <ErrorCard error={getArticleQuery.error} /> : null}
      {updateArticleMutation.error ? <ErrorCard error={updateArticleMutation.error} /> : null}

      <ArticleInfoForm
        item={getArticleQuery.data && getArticleQuery.data.article}
        loading={getArticleQuery.loading}
        wrappedComponentRef={(inst: unknown) => {
          articleInfoFormRef = inst;
        }}
      />

      <ArticleContentForm
        ref={articleCententForm}
        content={getArticleQuery.data && getArticleQuery.data.article && getArticleQuery.data.article.content}
      />

      <ArticleExtForm
        item={getArticleQuery.data && getArticleQuery.data.article}
        loading={getArticleQuery.loading}
        wrappedComponentRef={(inst: unknown) => {
          articleExtFormRef = inst;
        }}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          loading={updateArticleMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
