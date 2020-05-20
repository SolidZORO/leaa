import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Article, Tag, Action } from '@leaa/common/src/entrys';
import { IAttachmentBoxRef } from '@leaa/common/src/interfaces';
import { GET_ARTICLE, UPDATE_ARTICLE } from '@leaa/dashboard/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { ArticleArgs, UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { msg, errorMsg, ajax } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, WYSIWYGEditor, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

import { ArticleInfoForm } from '../_components/ArticleInfoForm/ArticleInfoForm';
import { ArticleExtForm } from '../_components/ArticleExtForm/ArticleExtForm';

import style from './style.module.less';

const API_PATH = 'articles';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const infoFormRef = useRef<ICommenFormRef<UpdateArticleInput>>(null);
  const extFormRef = useRef<ICommenFormRef<UpdateArticleInput>>(null);

  const [item, setItem] = useState<Article | undefined>();
  const [itemLoading, setItemLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const articleContentRef = useRef<any>(null);
  const attachmentBoxRef = useRef<IAttachmentBoxRef>(null);
  const selectTagIdRef = useRef<any>(null);
  const [articleTags, setArticleTags] = useState<Tag[]>();

  const onFetchItem = () => {
    setItemLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${API_PATH}/${id}`)
      .then((res: IHttpRes<Article>) => {
        setItem(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setItemLoading(false));
  };

  const onUpdateItem = async () => {
    const infoData: ISubmitData<UpdateArticleInput> = await infoFormRef.current?.onValidateForm();
    const extData: ISubmitData<UpdateArticleInput> = await extFormRef.current?.onValidateForm();

    if (!infoData) return;
    if (!extData) return;

    const data: ISubmitData<UpdateArticleInput> = {
      ...infoData,
      ...extData,
      content: articleContentRef.current?.props?.value,
    };

    data.tagIds = articleTags?.length ? articleTags.map((tag) => tag.id) : null;

    setSubmitLoading(true);

    ajax
      .patch(`${envConfig.API_URL}/${API_PATH}/${id}`, data)
      .then((res: IHttpRes<Article>) => {
        setItem(res.data.data);

        msg(t('_lang:updatedSuccessfully'));
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setSubmitLoading(false));

    // attachments
    await attachmentBoxRef.current?.onUpdateAttachments();
  };

  useEffect(() => onFetchItem(), []);

  return (
    <PageCard route={props.route} title="@EDIT" className={style['wapper']} loading={itemLoading || submitLoading}>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <ArticleInfoForm item={item} loading={itemLoading} ref={infoFormRef} />

      <WYSIWYGEditor
        ref={articleContentRef}
        content={item?.content}
        attachmentParams={{
          type: 'image',
          moduleId: id,
          moduleName: 'article',
          typeName: 'editor',
        }}
      />

      <div className={style['container-ext']}>
        <ArticleExtForm item={item} loading={itemLoading} ref={extFormRef} />
      </div>

      <SubmitBar full>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={submitLoading}
          onClick={onUpdateItem}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
