import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { User } from '@leaa/api/src/entrys';
import { UserCreateOneReq } from '@leaa/api/src/dtos/user';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes } from '@leaa/dashboard/src/interfaces';
import { fetcher } from '@leaa/dashboard/src/libs';
import { msg, httpErrorMsg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

import { UserInfoForm } from '../_components/UserInfoForm/UserInfoForm';

import style from './style.module.less';

const API_PATH = 'users';

export default (props: IPage) => {
  const { t } = useTranslation();
  const infoFormRef = useRef<ICommenFormRef<UserCreateOneReq>>(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const onCreateItem = async () => {
    const infoData: ISubmitData<UserCreateOneReq> = await infoFormRef.current?.onValidateForm();
    if (!infoData) return;

    const data: ISubmitData<UserCreateOneReq> = infoData;
    if (!data.phone) data.phone = null;
    if (!data.email) data.email = null;

    setSubmitLoading(true);

    fetcher
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, data)
      .then((res: IHttpRes<User>) => {
        msg(t('_lang:createdSuccessfully'));
        props.history.push(`/${API_PATH}/${res.data.data?.id}`);
      })
      .catch((err) => {
        setSubmitLoading(false);
        httpErrorMsg(err);
      });
  };

  return (
    <PageCard route={props.route} title="@CREATE" className={style['page-card-wapper']} loading={submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <UserInfoForm ref={infoFormRef} />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@CREATE', loading: submitLoading }}
        simpleButtonAction={onCreateItem}
      />
    </PageCard>
  );
};
