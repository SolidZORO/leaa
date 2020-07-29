import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Tag } from '@leaa/api/src/entrys';
import { TagUpdateOneReq } from '@leaa/api/src/dtos/tag';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError, IFetchRes } from '@leaa/dashboard/src/interfaces';
import { msg, errorMsg, setCrudQueryToUrl } from '@leaa/dashboard/src/utils';
import { useFetch, fetcher } from '@leaa/dashboard/src/libs';
import { envConfig } from '@leaa/dashboard/src/configs';

import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

import { TagInfoForm } from '../_components/TagInfoForm/TagInfoForm';

import style from './style.module.less';

const API_PATH = 'tags';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const infoFormRef = useRef<ICommenFormRef<TagUpdateOneReq>>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const item = useFetch<IFetchRes<Tag>>(
    { url: `${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}` },
    {
      onError: (err) => errorMsg(err.message),
      onSuccess: (res) => setCrudQueryToUrl({ window, query: res.config.crudQuery, replace: true }),
    },
  );

  const onUpdateItem = async () => {
    const infoData: ISubmitData<TagUpdateOneReq> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const data: ISubmitData<TagUpdateOneReq> = { ...infoData };
    setSubmitLoading(true);

    fetcher
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`, data)
      .then((res: IFetchRes<Tag>) => {
        item.mutate(res, false);

        msg(t('_lang:updatedSuccessfully'));
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setSubmitLoading(false));
  };

  return (
    <PageCard route={props.route} title="@UPDATE" className={style['wapper']} loading={item.loading || submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <TagInfoForm item={item?.data?.data} loading={item.loading} ref={infoFormRef} />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@UPDATE', loading: submitLoading }}
        simpleButtonAction={onUpdateItem}
      />
    </PageCard>
  );
};
