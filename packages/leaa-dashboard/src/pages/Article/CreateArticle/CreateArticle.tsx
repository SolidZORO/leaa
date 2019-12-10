import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Article } from '@leaa/common/src/entrys';
import { CreateArticleInput } from '@leaa/common/src/dtos/article';
import { IPage, IKey } from '@leaa/dashboard/src/interfaces';
import { CREATE_ARTICLE } from '@leaa/common/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { ArticleInfoForm } from '../_components/ArticleInfoForm/ArticleInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [articleInfoFormRef, setArticleInfoFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ article: CreateArticleInput }>();
  const [createArticleMutate, createArticleMutation] = useMutation<{ createArticle: Article }>(CREATE_ARTICLE, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createArticle }) {
      messageUtil.gqlCompleted(t('_lang:createdSuccessfully'));
      props.history.push(`/articles/${createArticle.id}`);
    },
  });

  const onSubmit = async () => {
    articleInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: CreateArticleInput) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      await setSubmitVariables({ article: formData });
      await createArticleMutate();
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
      loading={createArticleMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

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
