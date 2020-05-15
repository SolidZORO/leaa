import { AxiosResponse, AxiosError } from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

import { Action } from '@leaa/common/src/entrys';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { UpdateActionInput } from '@leaa/common/src/dtos/action';
import { IPage, ICommenFormRef, ICurdError, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { ajax, errorMsg, msg } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

import { ActionInfoForm } from '../_components/ActionInfoForm/ActionInfoForm';

import style from './style.module.less';

const ROUTE_NAME = 'actions';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdateActionInput>>(null);

  const [item, setItem] = useState<Action | undefined>();

  const [itemLoading, setitemLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchItem = () => {
    setitemLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${ROUTE_NAME}/${id}`)
      .then((res: AxiosResponse<Action>) => {
        setItem(res.data);
      })
      .catch((err: AxiosError<ICurdError>) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setitemLoading(false));
  };

  const updateItem = (data: UpdateActionInput) => {
    setSubmitLoading(true);

    ajax
      .patch(`${envConfig.API_URL}/${ROUTE_NAME}/${id}`, data)
      .then((res: AxiosResponse<Action>) => {
        setItem(res.data);

        msg(t('_lang:updatedSuccessfully'));
      })
      .catch((err: AxiosError<ICurdError>) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setSubmitLoading(false));
  };

  const onSubmit = async () => {
    const submitData: ISubmitData<UpdateActionInput> = await infoFormRef.current?.onValidateForm();
    if (!submitData) return;

    updateItem(submitData);
  };

  useEffect(() => fetchItem(), []);

  return (
    <PageCard
      title={
        <span>
          <Rcon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
        </span>
      }
      className={style['wapper']}
      loading={itemLoading || submitLoading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <ActionInfoForm item={item} loading={itemLoading} ref={infoFormRef} />

      <SubmitBar full>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          // loading={updateArticleMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
