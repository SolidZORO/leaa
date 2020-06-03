import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

import { Action } from '@leaa/common/src/entrys';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { ActionUpdateOneReq } from '@leaa/common/src/dtos/action';
import { IPage, ICommenFormRef, IHttpError, ISubmitData, IHttpRes } from '@leaa/dashboard/src/interfaces';
import { ajax, errorMsg, msg } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

import { ActionInfoForm } from '../_components/ActionInfoForm/ActionInfoForm';

import style from './style.module.less';

const API_PATH = 'actions';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const infoFormRef = useRef<ICommenFormRef<ActionUpdateOneReq>>(null);

  const [item, setItem] = useState<Action | undefined>();
  const [itemLoading, setitemLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const onFetchItem = () => {
    setitemLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/v1/${id}`)
      .then((res: IHttpRes<Action>) => {
        setItem(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setitemLoading(false));
  };

  const onUpdateItem = async () => {
    const data: ISubmitData<ActionUpdateOneReq> = await infoFormRef.current?.onValidateForm();
    if (!data) return;

    setSubmitLoading(true);

    ajax
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/v1/${id}`, data)
      .then((res: IHttpRes<Action>) => {
        setItem(res.data.data);

        msg(t('_lang:updatedSuccessfully'));
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setSubmitLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onFetchItem(), []);

  return (
    <PageCard route={props.route} title="@EDIT" className={style['wapper']} loading={itemLoading || submitLoading}>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <ActionInfoForm item={item} loading={itemLoading} ref={infoFormRef} />

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
