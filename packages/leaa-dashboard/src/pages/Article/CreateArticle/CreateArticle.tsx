import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Article } from '@leaa/common/src/entrys';
import { UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { CREATE_ARTICLE } from '@leaa/common/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { PageCard } from '@leaa/dashboard/src/components/PageCard';
import { HtmlMeta } from '@leaa/dashboard/src/components/HtmlMeta';
import { SubmitBar } from '@leaa/dashboard/src/components/SubmitBar/SubmitBar';
import { ErrorCard } from '@leaa/dashboard/src/components/ErrorCard';

import { ArticleInfoForm } from '../_components/ArticleInfoForm/ArticleInfoForm';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [articleInfoFormRef, setArticleInfoFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ article: UpdateArticleInput }>();
  const [createArticleMutate, createArticleMutation] = useMutation<{ createArticle: Article }>(CREATE_ARTICLE, {
    variables: submitVariables,
    onError: e => message.error(e.message),
    onCompleted({ createArticle }) {
      message.success(t('_lang:createdSuccessfully'));
      props.history.push(`/articles/${createArticle.id}`);
    },
  });

  const onSubmit = async () => {
    articleInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Article) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      await setSubmitVariables({ article: formData });
      await createArticleMutate();
    });
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['wapper']} loading={createArticleMutation.loading}>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {createArticleMutation.error ? <ErrorCard error={createArticleMutation.error} /> : null}

      <ArticleInfoForm wrappedComponentRef={(inst: unknown) => setArticleInfoFormRef(inst)} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={CREATE_BUTTON_ICON}
          className="submit-button"
          loading={createArticleMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
