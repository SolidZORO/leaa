import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Article } from '@leaa/common/src/entrys';
import { IAttachmentBoxRef } from '@leaa/common/src/interfaces';
import { GET_ARTICLE, UPDATE_ARTICLE } from '@leaa/common/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { ArticleArgs, UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { WYSIWYGEditor } from '@leaa/dashboard/src/components/WYSIWYGEditor/WYSIWYGEditor';
import { AttachmentBox } from '@leaa/dashboard/src/components/AttachmentBox';
import { PageCard } from '@leaa/dashboard/src/components/PageCard';
import { HtmlMeta } from '@leaa/dashboard/src/components/HtmlMeta';
import { ErrorCard } from '@leaa/dashboard/src/components/ErrorCard';

import { ArticleInfoForm } from '../_components/ArticleInfoForm/ArticleInfoForm';
import { ArticleExtForm } from '../_components/ArticleExtForm/ArticleExtForm';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const attachmentBoxRef = useRef<IAttachmentBoxRef>(null);
  const articleContentForm = React.createRef<any | null>();
  const [articleInfoFormRef, setArticleInfoFormRef] = useState<any>();
  const [articleExtFormRef, setArticleExtFormRef] = useState<any>();

  // get
  const getArticleVariables = { id: Number(id) };
  const getArticleQuery = useQuery<{ article: Article }, ArticleArgs>(GET_ARTICLE, {
    variables: getArticleVariables,
    fetchPolicy: 'network-only',
  });

  // set
  const [submitVariables, setSubmitVariables] = useState<{ id: number; article: UpdateArticleInput }>();
  const [updateArticleMutate, updateArticleMutation] = useMutation<Article>(UPDATE_ARTICLE, {
    variables: submitVariables,
    onCompleted: () => message.success(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_ARTICLE, variables: getArticleVariables }],
  });

  // TIPS: keep data consistent with API
  const resetAllFormAfterSubmit = () => {
    articleInfoFormRef.props.form.resetFields();
    articleExtFormRef.props.form.resetFields();
  };

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
      articleContentForm &&
      articleContentForm.current &&
      articleContentForm.current.getInstance() &&
      articleContentForm.current.getInstance().getHtml() &&
      typeof articleContentForm.current.getInstance().getHtml() !== 'undefined'
    ) {
      submitData.content = articleContentForm.current.getInstance().getHtml();
    }

    await setSubmitVariables({ id: Number(id), article: submitData });
    await updateArticleMutate();

    // attachment box
    if (attachmentBoxRef && attachmentBoxRef.current) {
      attachmentBoxRef.current.onUpdateAttachments();
    }

    resetAllFormAfterSubmit();
  };

  return (
    <PageCard
      title={t(`${props.route.namei18n}`)}
      className={style['wapper']}
      loading={getArticleQuery.loading || updateArticleMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getArticleQuery.error ? <ErrorCard error={getArticleQuery.error} /> : null}
      {updateArticleMutation.error ? <ErrorCard error={updateArticleMutation.error} /> : null}

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
        ref={articleContentForm}
        content={getArticleQuery.data && getArticleQuery.data.article && getArticleQuery.data.article.content}
        attachmentParams={{
          type: 'image',
          moduleId: Number(id),
          moduleName: 'article',
          moduleType: 'editor',
        }}
      />

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
              moduleType: 'banner',
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
