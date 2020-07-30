import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Role, Permission } from '@leaa/api/src/entrys';
import { RoleUpdateOneReq } from '@leaa/api/src/dtos/role';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, ICrudListRes, IFetchRes } from '@leaa/dashboard/src/interfaces';
import { fetcher, useSWR } from '@leaa/dashboard/src/libs';
import { msg, httpErrorMsg } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

import { RoleInfoForm } from '../_components/RoleInfoForm/RoleInfoForm';
import { RolePermissionsForm } from '../_components/RolePermissionsForm/RolePermissionsForm';

import style from './style.module.less';

const API_PATH = 'roles';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const infoFormRef = useRef<ICommenFormRef<RoleUpdateOneReq>>(null);
  const permissionsRef = useRef<ICommenFormRef<RoleUpdateOneReq>>(null);

  const item = useSWR<IFetchRes<Role>>(
    { url: `${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}` },
    { onError: httpErrorMsg },
  );

  const permissions = useSWR<IFetchRes<ICrudListRes<Permission>>>(
    { url: `${envConfig.API_URL}/${envConfig.API_VERSION}/permissions` },
    { onError: httpErrorMsg },
  );

  const [submitLoading, setSubmitLoading] = useState(false);
  const onUpdateItem = async () => {
    if (submitLoading) return;

    const infoData: ISubmitData<RoleUpdateOneReq> = await infoFormRef.current?.onValidateForm();
    const permissionsData: ISubmitData<RoleUpdateOneReq> = await permissionsRef.current?.onValidateForm();

    if (!infoData) return;
    if (!permissionsData || (permissionsData && !Array.isArray(permissionsData.permissionIds))) return;

    const data: ISubmitData<RoleUpdateOneReq> = {
      ...infoData,
      ...permissionsData,
    };

    setSubmitLoading(true);

    fetcher
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`, data)
      .then((res: IHttpRes<Role>) => {
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

      <RoleInfoForm ref={infoFormRef} item={item?.data?.data} loading={item.loading} />

      <RolePermissionsForm
        ref={permissionsRef}
        item={item?.data?.data}
        loading={permissions.loading}
        permissions={permissions?.data?.data?.data || []}
      />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@UPDATE', loading: submitLoading }}
        simpleButtonAction={onUpdateItem}
      />
    </PageCard>
  );
};
