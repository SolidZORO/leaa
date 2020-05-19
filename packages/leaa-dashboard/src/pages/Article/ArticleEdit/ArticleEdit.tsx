import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Article, Tag } from '@leaa/common/src/entrys';
import { IAttachmentBoxRef } from '@leaa/common/src/interfaces';
import { GET_ARTICLE, UPDATE_ARTICLE } from '@leaa/dashboard/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { ArticleArgs, UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msg } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, WYSIWYGEditor, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

import { ArticleInfoForm } from '../_components/ArticleInfoForm/ArticleInfoForm';
import { ArticleExtForm } from '../_components/ArticleExtForm/ArticleExtForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdateArticleInput>>(null);
  const extFormRef = useRef<ICommenFormRef<UpdateArticleInput>>(null);

  const articleContentRef = useRef<any>(null);
  const attachmentBoxRef = useRef<IAttachmentBoxRef>(null);
  const selectTagIdRef = useRef<any>(null);
  const [articleTags, setArticleTags] = useState<Tag[]>();

  // query
  const getArticleVariables = { id };
  const getArticleQuery = useQuery<{ article: Article }, ArticleArgs>(GET_ARTICLE, {
    variables: getArticleVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: string; article: UpdateArticleInput }>();
  const [updateArticleMutate, updateArticleMutation] = useMutation<Article>(UPDATE_ARTICLE, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msg(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_ARTICLE, variables: getArticleVariables }],
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<UpdateArticleInput> = await infoFormRef.current?.onValidateForm();
    const extData: ISubmitData<UpdateArticleInput> = await extFormRef.current?.onValidateForm();

    if (!infoData) return;
    if (!extData) return;

    const submitData: ISubmitData<UpdateArticleInput> = {
      ...infoData,
      ...extData,
    };

    submitData.content = articleContentRef.current?.props.value;

    if (typeof submitData.categoryIds === 'undefined') {
      submitData.categoryIds = null;
    }

    submitData.tagIds = articleTags?.length ? articleTags.map((item) => item.id) : null;

    await setSubmitVariables({ id, article: submitData });
    await updateArticleMutate();

    // attachments
    await attachmentBoxRef.current?.onUpdateAttachments();
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
      loading={getArticleQuery.loading || updateArticleMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <ArticleInfoForm item={getArticleQuery.data?.article} loading={getArticleQuery.loading} ref={infoFormRef} />

      <WYSIWYGEditor
        ref={articleContentRef}
        content={getArticleQuery.data?.article?.content}
        attachmentParams={{
          type: 'image',
          moduleId: id,
          moduleName: 'article',
          typeName: 'editor',
        }}
      />

      <SubmitBar full>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={updateArticleMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
