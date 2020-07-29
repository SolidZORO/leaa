import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { User, Role } from '@leaa/api/src/entrys';
import { IAttachmentBoxRef } from '@leaa/api/src/interfaces';
import { UserUpdateOneReq } from '@leaa/api/src/dtos/user';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError, ICrudListRes } from '@leaa/dashboard/src/interfaces';
import { msg, errorMsg } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

import { UserInfoForm } from '../_components/UserInfoForm/UserInfoForm';
import { UserRolesForm } from '../_components/UserRolesForm/UserRolesForm';

import style from './style.module.less';

const API_PATH = 'users';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const infoFormRef = useRef<ICommenFormRef<UserUpdateOneReq>>(null);
  const rolesFormRef = useRef<ICommenFormRef<UserUpdateOneReq>>(null);

  const [item, setItem] = useState<User | undefined>();
  const [itemLoading, setItemLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [roles, setRoles] = useState<Role[]>();
  const [rolesLoading, setRolesLoading] = useState(false);

  const attachmentBoxRef = useRef<IAttachmentBoxRef>(null);

  const onFetchItem = () => {
    setItemLoading(true);

    fetcher
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`)
      .then((res: IHttpRes<User>) => {
        setItem(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setItemLoading(false));
  };

  const onFetchRoles = () => {
    setRolesLoading(true);

    fetcher
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/roles`)
      .then((res: IHttpRes<ICrudListRes<Role>>) => {
        // console.log(res.data.data?.data);
        setRoles(res.data.data?.data);

        // setItem(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setRolesLoading(false));
  };

  const onUpdateItem = async () => {
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
        setItem(res.data.data);

        msg(t('_lang:updatedSuccessfully'));
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setSubmitLoading(false));

    // attachments
    await attachmentBoxRef.current?.onUpdateAttachments();
  };

  useEffect(() => {
    onFetchItem();
    onFetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageCard route={props.route} title="@UPDATE" className={style['wapper']} loading={itemLoading || submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <UserInfoForm item={item} loading={itemLoading} ref={infoFormRef} />

      <UserRolesForm ref={rolesFormRef} item={item} loading={rolesLoading} roles={roles || []} />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@UPDATE', loading: submitLoading }}
        simpleButtonAction={onUpdateItem}
      />
    </PageCard>
  );
};
