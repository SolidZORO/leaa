import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { User, Role } from '@leaa/api/src/entrys';
import { IAttachmentBoxRef } from '@leaa/api/src/interfaces';
import { UserUpdateOneReq } from '@leaa/api/src/dtos/user';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, ICrudListRes, IFetchRes } from '@leaa/dashboard/src/interfaces';
import { msg, httpErrorMsg } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';
import { fetcher, useSWR } from '@leaa/dashboard/src/libs';

import { UserInfoForm } from '../_components/UserInfoForm/UserInfoForm';
import { UserRolesForm } from '../_components/UserRolesForm/UserRolesForm';

import style from './style.module.less';

const API_PATH = 'users';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const infoFormRef = useRef<ICommenFormRef<UserUpdateOneReq>>(null);
  const rolesFormRef = useRef<ICommenFormRef<UserUpdateOneReq>>(null);
  const attachmentBoxRef = useRef<IAttachmentBoxRef>(null);

  const item = useSWR<IFetchRes<User>>(
    { url: `${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}` },
    { onError: httpErrorMsg },
  );

  const roles = useSWR<IFetchRes<ICrudListRes<Role>>>(
    { url: `${envConfig.API_URL}/${envConfig.API_VERSION}/roles` },
    { onError: httpErrorMsg },
  );

  const [submitLoading, setSubmitLoading] = useState(false);
  const onUpdateItem = async () => {
    if (submitLoading) return;

    const infoData: ISubmitData<UserUpdateOneReq> = await infoFormRef.current?.onValidateForm();
    const userRolesData: ISubmitData<UserUpdateOneReq> = await rolesFormRef.current?.onValidateForm();

    if (!infoData) return;
    if (!userRolesData) return;

    const data: ISubmitData<UserUpdateOneReq> = {
      ...infoData,
      ...userRolesData,
    };

    if (!data.phone) data.phone = null;
    if (!data.email) data.email = null;

    setSubmitLoading(true);

    fetcher
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`, data)
      .then((res: IHttpRes<User>) => {
        item.mutate(res, false);

        msg(t('_lang:updatedSuccessfully'));
      })
      .catch(httpErrorMsg)
      .finally(() => setSubmitLoading(false));

    // attachments
    await attachmentBoxRef.current?.onUpdateAttachments();
  };

  return (
    <PageCard
      route={props.route}
      title="@UPDATE"
      className={style['page-card-wapper']}
      loading={item.loading || submitLoading}
    >
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <UserInfoForm ref={infoFormRef} item={item?.data?.data} loading={item.loading} />

      <UserRolesForm
        ref={rolesFormRef}
        item={item?.data?.data}
        loading={roles.loading}
        roles={roles?.data?.data?.data || []}
      />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@UPDATE', loading: submitLoading }}
        simpleButtonAction={onUpdateItem}
      />
    </PageCard>
  );
};
