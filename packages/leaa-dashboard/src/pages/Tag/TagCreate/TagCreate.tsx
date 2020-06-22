import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

import { Tag } from '@leaa/api/src/entrys';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { TagUpdateOneReq } from '@leaa/api/src/dtos/tag';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { msg, errorMsg, ajax } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

import { TagInfoForm } from '../_components/TagInfoForm/TagInfoForm';

import style from './style.module.less';

const API_PATH = 'tags';

export default (props: IPage) => {
  const { t } = useTranslation();

  const infoFormRef = useRef<ICommenFormRef<TagUpdateOneReq>>(null);

  const [submitLoading, setSubmitLoading] = useState(false);

  const onCreateItem = async () => {
    const infoData: ISubmitData<TagUpdateOneReq> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const data: ISubmitData<TagUpdateOneReq> = {
      ...infoData,
    };

    setSubmitLoading(true);

    ajax
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, data)
      .then((res: IHttpRes<Tag>) => {
        msg(t('_lang:createdSuccessfully'));

        props.history.push(`/${API_PATH}/${res.data.data?.id}`);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setSubmitLoading(false));
  };

  return (
    <PageCard route={props.route} title="@CREATE" className={style['wapper']} loading={submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <TagInfoForm ref={infoFormRef} />

      <SubmitBar full>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={submitLoading}
          onClick={onCreateItem}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
