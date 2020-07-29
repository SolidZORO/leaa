import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Article } from '@leaa/api/src/entrys';
import { ArticleUpdateOneReq } from '@leaa/api/src/dtos/article';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { msg, errorMsg } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

import { ArticleInfoForm } from '../_components/ArticleInfoForm/ArticleInfoForm';

import style from './style.module.less';

const API_PATH = 'articles';

export default (props: IPage) => {
  const { t } = useTranslation();

  const infoFormRef = useRef<ICommenFormRef<ArticleUpdateOneReq>>(null);

  const [submitLoading, setSubmitLoading] = useState(false);

  const onCreateItem = async () => {
    const infoData: ISubmitData<ArticleUpdateOneReq> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const data: ISubmitData<ArticleUpdateOneReq> = {
      ...infoData,
    };

    setSubmitLoading(true);

    fetcher
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, data)
      .then((res: IHttpRes<Article>) => {
        msg(t('_lang:createdSuccessfully'));

        props.history.push(`/${API_PATH}/${res.data.data?.id}`);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setSubmitLoading(false));
  };

  return (
    <PageCard route={props.route} title="@CREATE" className={style['wapper']} loading={submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <ArticleInfoForm ref={infoFormRef} />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@CREATE', loading: submitLoading }}
        simpleButtonAction={onCreateItem}
      />
    </PageCard>
  );
};
