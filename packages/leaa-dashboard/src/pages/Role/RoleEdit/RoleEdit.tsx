import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

import { Role, Permission } from '@leaa/common/src/entrys';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { RoleUpdateOneReq } from '@leaa/common/src/dtos/role';
import {
  IPage,
  ICommenFormRef,
  ISubmitData,
  IHttpRes,
  IHttpError,
  ICrudListQueryParams,
  ICrudListRes,
} from '@leaa/dashboard/src/interfaces';
import { msg, errorMsg, ajax } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

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

    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`)
      .then((res: IHttpRes<Role>) => {
        setItem(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setItemLoading(false));
  };

  const onFetchpPrmissions = () => {
    setPrmissionsLoading(true);

    ajax
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

    ajax
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
  }, []);

  return (
    <PageCard route={props.route} title="@EDIT" className={style['wapper']} loading={itemLoading || submitLoading}>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <RoleInfoForm item={item} loading={itemLoading} ref={infoFormRef} />

      <RolePermissionsForm
        ref={permissionsRef}
        item={item}
        loading={prmissionsLoading}
        permissions={prmissions || []}
      />

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
