import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Category } from '@leaa/api/src/entrys';
import { CategoryUpdateOneReq } from '@leaa/api/src/dtos/category';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { msg, errorMsg } from '@leaa/dashboard/src/utils';
import { fetcher } from '@leaa/dashboard/src/libs';
import { envConfig } from '@leaa/dashboard/src/configs';

import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

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

    fetcher
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

    fetcher
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
    <PageCard route={props.route} title="@UPDATE" className={style['wapper']} loading={itemLoading || submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <CategoryInfoForm item={item} loading={itemLoading} ref={infoFormRef} />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@UPDATE', loading: submitLoading }}
        simpleButtonAction={onUpdateItem}
      />
    </PageCard>
  );
};
