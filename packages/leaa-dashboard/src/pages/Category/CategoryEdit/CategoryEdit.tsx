import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

import { Category } from '@leaa/common/src/entrys';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { CategoryUpdateOneReq } from '@leaa/common/src/dtos/category';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { msg, errorMsg, ajax } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';

import { PageCard, HtmlMeta, Rcon, SubmitBar } from '@leaa/dashboard/src/components';

import { CategoryInfoForm } from '../_components/CategoryInfoForm/CategoryInfoForm';

import style from './style.module.less';

const API_PATH = 'categories';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const infoFormRef = useRef<ICommenFormRef<CategoryUpdateOneReq>>(null);

  const [item, setItem] = useState<Category | undefined>();
  const [itemLoading, setItemLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const onFetchItem = () => {
    setItemLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`)
      .then((res: IHttpRes<Category>) => {
        setItem(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setItemLoading(false));
  };

  const onUpdateItem = async () => {
    const infoData: ISubmitData<CategoryUpdateOneReq> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const data: ISubmitData<CategoryUpdateOneReq> = {
      ...infoData,
    };

    setSubmitLoading(true);

    ajax
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`, data)
      .then((res: IHttpRes<Category>) => {
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

      <CategoryInfoForm item={item} loading={itemLoading} ref={infoFormRef} />

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
