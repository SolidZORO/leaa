import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message, Row, Col } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { BraftEditorProps } from 'braft-editor';

import { Article } from '@leaa/common/entrys';
import { IMediaItem, IAttachmentBoxRef } from '@leaa/common/interfaces';
import { GET_ARTICLE, UPDATE_ARTICLE, GET_ATTACHMENTS, DELETE_ATTACHMENT } from '@leaa/common/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/constants';
import { ArticleArgs, UpdateArticleInput } from '@leaa/common/dtos/article';
import { IPage } from '@leaa/dashboard/interfaces';
import { AttachmentsWithPaginationObject, AttachmentsArgs } from '@leaa/common/dtos/attachment';
import { WYSIWYGEditor } from '@leaa/dashboard/components/WYSIWYGEditor/WYSIWYGEditor';
import { AttachmentBox } from '@leaa/dashboard/components/AttachmentBox';
import { langUtil } from '@leaa/dashboard/utils';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';
import { FormCard } from '@leaa/dashboard/components/FormCard';

import { ArticleInfoForm } from '../_components/ArticleInfoForm/ArticleInfoForm';
import { ArticleExtForm } from '../_components/ArticleExtForm/ArticleExtForm';

import style from './style.less';

export default (props: IPage) => {
  const { t, i18n } = useTranslation();
  const { id } = props.match.params as { id: string };

  const attachmentBoxRef = useRef<IAttachmentBoxRef>(null);
  let articleInfoFormRef: any;
  let articleExtFormRef: any;

  const articleCententForm = React.createRef<{ props: BraftEditorProps } | null>();

  const getArticleVariables = { id: Number(id) };
  const getArticleQuery = useQuery<{ article: Article }, ArticleArgs>(GET_ARTICLE, {
    variables: getArticleVariables,
  });

  const [getArticleEditorAttachmentsVariables, setGetArticleEditorAttachmentsVariables] = useState<AttachmentsArgs>({
    moduleName: 'article',
    moduleType: 'editor',
    moduleId: Number(id),
    orderSort: 'ASC',
    refreshHash: 0,
  });
  const getArticleEditorAttachmentsQuery = useQuery<{ attachments: AttachmentsWithPaginationObject }, AttachmentsArgs>(
    GET_ATTACHMENTS,
    { variables: getArticleEditorAttachmentsVariables },
  );

  const [submitVariables, setSubmitVariables] = useState<{ id: number; article: UpdateArticleInput }>();
  const [updateArticleMutate, updateArticleMutation] = useMutation<Article>(UPDATE_ARTICLE, {
    variables: submitVariables,
    onCompleted: () => message.success(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [
      { query: GET_ARTICLE, variables: getArticleVariables },
      { query: GET_ATTACHMENTS, variables: getArticleEditorAttachmentsVariables },
    ],
  });

  const [deleteAttachmentsVariables, setDeleteAttachmentsVariables] = useState<{ uuid: string[] }>();
  const [deleteAttachmentsMutate, deleteAttachmentsMutation] = useMutation<{ uuid: string[] }>(DELETE_ATTACHMENT, {
    variables: deleteAttachmentsVariables,
    onCompleted: () => message.success(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_ATTACHMENTS, variables: getArticleEditorAttachmentsVariables }],
  });

  const onRemoveMedias = async (attachments: IMediaItem[]) => {
    console.log(attachments.map(a => a.id));

    await setDeleteAttachmentsVariables({ uuid: attachments.map(a => a.id) });
    await deleteAttachmentsMutate();
  };

  const onOpenBraftFinder = async () => {
    setGetArticleEditorAttachmentsVariables({
      ...getArticleEditorAttachmentsVariables,
      refreshHash: new Date().getMilliseconds(),
    });
  };

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

    if (attachmentBoxRef && attachmentBoxRef.current) {
      attachmentBoxRef.current.onUpdateAttachments();
    }
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['wapper']} loading={false}>
      {getArticleQuery.error ? <ErrorCard error={getArticleQuery.error} /> : null}
      {getArticleEditorAttachmentsQuery.error ? <ErrorCard error={getArticleEditorAttachmentsQuery.error} /> : null}
      {updateArticleMutation.error ? <ErrorCard error={updateArticleMutation.error} /> : null}
      {deleteAttachmentsMutation.error ? <ErrorCard error={deleteAttachmentsMutation.error} /> : null}

      <ArticleInfoForm
        item={getArticleQuery.data && getArticleQuery.data.article}
        loading={getArticleQuery.loading}
        wrappedComponentRef={(inst: unknown) => {
          articleInfoFormRef = inst;
        }}
      />

      <WYSIWYGEditor
        ref={articleCententForm}
        content={getArticleQuery.data && getArticleQuery.data.article && getArticleQuery.data.article.content}
        braftEditorProps={{ contentStyle: { height: 700 } }}
        attachmentParams={{
          type: 'image',
          moduleId: Number(id),
          moduleName: 'article',
          moduleType: 'editor',
        }}
        attachmentItems={
          getArticleEditorAttachmentsQuery.data &&
          getArticleEditorAttachmentsQuery.data.attachments &&
          getArticleEditorAttachmentsQuery.data.attachments.items
        }
        onRemoveMedias={onRemoveMedias}
        onOpenBraftFinder={onOpenBraftFinder}
      />

      <ArticleExtForm
        item={getArticleQuery.data && getArticleQuery.data.article}
        loading={getArticleQuery.loading}
        wrappedComponentRef={(inst: unknown) => {
          articleExtFormRef = inst;
        }}
      />

      <Row gutter={16}>
        <Col xs={24}>
          <AttachmentBox
            disableMessage
            ref={attachmentBoxRef}
            attachmentParams={{
              type: 'image',
              moduleId: Number(id),
              moduleName: 'article',
              moduleType: 'banner',
            }}
          />
        </Col>
      </Row>

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
