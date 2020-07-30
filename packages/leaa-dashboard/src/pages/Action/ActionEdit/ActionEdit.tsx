import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Action } from '@leaa/api/src/entrys';
import { ActionUpdateOneReq } from '@leaa/api/src/dtos/action';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IFetchRes } from '@leaa/dashboard/src/interfaces';

import { envConfig } from '@leaa/dashboard/src/configs';
import { fetcher, useSWR } from '@leaa/dashboard/src/libs';
import { msg, httpErrorMsg } from '@leaa/dashboard/src/utils';
import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

import { ActionInfoForm } from '../_components/ActionInfoForm/ActionInfoForm';

import style from './style.module.less';

const API_PATH = 'actions';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const infoFormRef = useRef<ICommenFormRef<ActionUpdateOneReq>>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const item = useSWR<IFetchRes<Action>>(
    { url: `${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}` },
    { onError: httpErrorMsg },
  );

  const onUpdateItem = async () => {
    if (submitLoading) return;

    const data: ISubmitData<ActionUpdateOneReq> = await infoFormRef.current?.onValidateForm();
    if (!data) return;

    setSubmitLoading(true);

    fetcher
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/v1/${id}`, data)
      .then((res: IHttpRes<Action>) => {
        item.mutate(res, false);
        msg(t('_lang:updatedSuccessfully'));
      })
      .catch(httpErrorMsg)
      .finally(() => setSubmitLoading(false));
  };

  return (
    <PageCard
      route={props.route}
      title="@UPDATE"
      className={style['page-card-wapper']}
      loading={item.loading || submitLoading}
    >
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <ActionInfoForm item={item?.data?.data} loading={item.loading} ref={infoFormRef} />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@UPDATE', loading: submitLoading }}
        simpleButtonAction={onUpdateItem}
      />
    </PageCard>
  );
};
