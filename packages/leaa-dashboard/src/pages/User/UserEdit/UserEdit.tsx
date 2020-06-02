import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

import { User, Role } from '@leaa/common/src/entrys';
import { IAttachmentBoxRef } from '@leaa/common/src/interfaces';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { UserUpdateOneReq } from '@leaa/common/src/dtos/user';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError, ICrudListRes } from '@leaa/dashboard/src/interfaces';
import { msg, errorMsg, ajax } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

import { UserInfoForm } from '../_components/UserInfoForm/UserInfoForm';
import { UserRolesForm } from '../_components/UserRolesForm/UserRolesForm';
import { UploadUserAvatar } from '../_components/UploadUserAvatar/UploadUserAvatar';
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

    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`)
      .then((res: IHttpRes<User>) => {
        setItem(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setItemLoading(false));
  };

  const onFetchRoles = () => {
    setRolesLoading(true);

    ajax
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

    ajax
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
  }, []);

  return (
    <PageCard route={props.route} title="@EDIT" className={style['wapper']} loading={itemLoading || submitLoading}>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <UserInfoForm item={item} loading={itemLoading} ref={infoFormRef} />

      <UploadUserAvatar item={item} loading={itemLoading} />

      <UserRolesForm ref={rolesFormRef} item={item} loading={rolesLoading} roles={roles || []} />

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
