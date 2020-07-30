import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Permission } from '@leaa/api/src/entrys';
import { PermissionUpdateOneReq } from '@leaa/api/src/dtos/permission';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IFetchRes } from '@leaa/dashboard/src/interfaces';
import { fetcher, useSWR } from '@leaa/dashboard/src/libs';
import { msg, httpErrorMsg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

import { PermissionInfoForm } from '../_components/PermissionInfoForm/PermissionInfoForm';

import style from './style.module.less';

const API_PATH = 'permissions';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const infoFormRef = useRef<ICommenFormRef<PermissionUpdateOneReq>>(null);

  const item = useSWR<IFetchRes<Permission>>(
    { url: `${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}` },
    { onError: httpErrorMsg },
  );

  const [submitLoading, setSubmitLoading] = useState(false);
  const onUpdateItem = async () => {
    if (submitLoading) return;

    const data: ISubmitData<PermissionUpdateOneReq> = await infoFormRef.current?.onValidateForm();
    if (!data) return;

    setSubmitLoading(true);

    fetcher
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`, data)
      .then((res: IHttpRes<Permission>) => {
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

      <PermissionInfoForm ref={infoFormRef} item={item?.data?.data} loading={item.loading} />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@UPDATE', loading: submitLoading }}
        simpleButtonAction={onUpdateItem}
      />
    </PageCard>
  );
};
