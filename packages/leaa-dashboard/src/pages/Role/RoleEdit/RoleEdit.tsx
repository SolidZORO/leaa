import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Role, Permission } from '@leaa/api/src/entrys';
import { RoleUpdateOneReq } from '@leaa/api/src/dtos/role';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError, ICrudListRes } from '@leaa/dashboard/src/interfaces';
import { fetcher } from '@leaa/dashboard/src/libs';
import { msg, errorMsg } from '@leaa/dashboard/src/utils';

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

  const [item, setItem] = useState<Role | undefined>();
  const [itemLoading, setItemLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [prmissions, setPrmissions] = useState<Permission[] | undefined>([]);
  const [prmissionsLoading, setPrmissionsLoading] = useState(false);

  const onFetchItem = () => {
    setItemLoading(true);

    fetcher
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`)
      .then((res: IHttpRes<Role>) => {
        setItem(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setItemLoading(false));
  };

  const onFetchpPrmissions = () => {
    setPrmissionsLoading(true);

    fetcher
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/permissions`)
      .then((res: IHttpRes<ICrudListRes<Permission>>) => {
        setPrmissions(res.data.data?.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setPrmissionsLoading(false));
  };

  const onUpdateItem = async () => {
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
        setItem(res.data.data);

        msg(t('_lang:updatedSuccessfully'));
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setSubmitLoading(false));
  };

  useEffect(() => {
    onFetchItem();
    onFetchpPrmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageCard route={props.route} title="@UPDATE" className={style['wapper']} loading={itemLoading || submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <RoleInfoForm item={item} loading={itemLoading} ref={infoFormRef} />

      <RolePermissionsForm
        ref={permissionsRef}
        item={item}
        loading={prmissionsLoading}
        permissions={prmissions || []}
      />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@UPDATE', loading: submitLoading }}
        simpleButtonAction={onUpdateItem}
      />
    </PageCard>
  );
};
