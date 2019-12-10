import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Article, Tag } from '@leaa/common/src/entrys';
import { IAttachmentBoxRef } from '@leaa/common/src/interfaces';
import { GET_ARTICLE, UPDATE_ARTICLE } from '@leaa/common/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { ArticleArgs, UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { IPage, IKey } from '@leaa/dashboard/src/interfaces';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, WYSIWYGEditor, AttachmentBox, SelectTagId, Rcon } from '@leaa/dashboard/src/components';

import { ArticleInfoForm } from '../_components/ArticleInfoForm/ArticleInfoForm';
import { ArticleExtForm } from '../_components/ArticleExtForm/ArticleExtForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const selectTagIdRef = useRef<any>(null);
  const attachmentBoxRef = useRef<IAttachmentBoxRef>(null);
  const articleContentRef = useRef<any>(null);
  const [articleInfoFormRef, setArticleInfoFormRef] = useState<any>();
  const [articleExtFormRef, setArticleExtFormRef] = useState<any>();
  const [articleTags, setArticleTags] = useState<Tag[]>();

  // query
  const getArticleVariables = { id: Number(id) };
  const getArticleQuery = useQuery<{ article: Article }, ArticleArgs>(GET_ARTICLE, {
    variables: getArticleVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: number; article: UpdateArticleInput }>();
  const [updateArticleMutate, updateArticleMutation] = useMutation<Article>(UPDATE_ARTICLE, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlCompleted(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_ARTICLE, variables: getArticleVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateArticleInput = {};

    // info
    articleInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Article) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      submitData = formData;
    });

    if (hasError) {
      return;
    }

    // ext
    articleExtFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Article) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
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
      articleContentRef &&
      articleContentRef.current &&
      articleContentRef.current.getInstance() &&
      articleContentRef.current.getInstance().getHtml() &&
      typeof articleContentRef.current.getInstance().getHtml() !== 'undefined'
    ) {
      submitData.content = articleContentRef.current.getInstance().getHtml();
    }

    submitData.tagIds = articleTags && articleTags.length > 0 ? articleTags.map(item => Number(item.id)) : undefined;

    await setSubmitVariables({ id: Number(id), article: submitData });
    await updateArticleMutate();

    // attachment box
    if (attachmentBoxRef && attachmentBoxRef.current) {
      attachmentBoxRef.current.onUpdateAttachments();
    }

    // keep form fields consistent with API
    articleInfoFormRef.props.form.resetFields();
    articleExtFormRef.props.form.resetFields();
  };

  const onChangeSelectedTagsCallback = (tags: Tag[]) => {
    setArticleTags(tags);
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

      <ArticleInfoForm
        item={getArticleQuery.data && getArticleQuery.data.article}
        loading={getArticleQuery.loading}
        wrappedComponentRef={(inst: unknown) => setArticleInfoFormRef(inst)}
      />

      <div className={style['submit-bar']}>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className={style['submit-bar-button']}
          loading={updateArticleMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </div>

      <WYSIWYGEditor
        ref={articleContentRef}
        content={getArticleQuery.data && getArticleQuery.data.article && getArticleQuery.data.article.content}
        attachmentParams={{
          type: 'image',
          moduleId: Number(id),
          moduleName: 'article',
          typeName: 'editor',
        }}
      />

      <div className={style['select-tag-id-wrapper']}>
        <SelectTagId
          ref={selectTagIdRef}
          placement="topLeft"
          enterCreateTag
          selectedTagsMaxLength={5}
          selectedTags={getArticleQuery.data && getArticleQuery.data.article && getArticleQuery.data.article.tags}
          onChangeSelectedTagsCallback={onChangeSelectedTagsCallback}
        />
      </div>

      <div className={style['container-wrapper']}>
        <div className={style['container-main']}>
          <AttachmentBox
            disableMessage
            ref={attachmentBoxRef}
            listHeight={217}
            attachmentParams={{
              type: 'image',
              moduleId: Number(id),
              moduleName: 'article',
              typeName: 'banner',
            }}
          />
        </div>

        <div className={style['container-ext']}>
          <ArticleExtForm
            item={getArticleQuery.data && getArticleQuery.data.article}
            loading={getArticleQuery.loading}
            wrappedComponentRef={(inst: unknown) => setArticleExtFormRef(inst)}
          />
        </div>
      </div>
    </PageCard>
  );
};
