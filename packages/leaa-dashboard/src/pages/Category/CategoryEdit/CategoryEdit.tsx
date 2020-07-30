import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Category } from '@leaa/api/src/entrys';
import { CategoryUpdateOneReq } from '@leaa/api/src/dtos/category';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IFetchRes } from '@leaa/dashboard/src/interfaces';
import { msg, httpErrorMsg } from '@leaa/dashboard/src/utils';
import { fetcher, useSWR } from '@leaa/dashboard/src/libs';
import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

import { CategoryInfoForm } from '../_components/CategoryInfoForm/CategoryInfoForm';

import style from './style.module.less';

const API_PATH = 'categories';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const infoFormRef = useRef<ICommenFormRef<CategoryUpdateOneReq>>(null);

  const item = useSWR<IFetchRes<Category>>(
    { url: `${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}` },
    { onError: httpErrorMsg },
  );

  const [submitLoading, setSubmitLoading] = useState(false);
  const onUpdateItem = async () => {
    if (submitLoading) return;

    const data: ISubmitData<CategoryUpdateOneReq> = await infoFormRef.current?.onValidateForm();
    if (!data) return;

    setSubmitLoading(true);

    fetcher
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`, data)
      .then((res: IHttpRes<Category>) => {
        item.mutate(res, false);

        msg(t('_lang:updatedSuccessfully'));
      })
      .catch(httpErrorMsg)
      .finally(() => setSubmitLoading(false));
  };

  return (
    <PageCard
      route={props.route}
      title="@UPDATE"
      className={style['page-card-wapper']}
      loading={item.loading || submitLoading}
    >
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <CategoryInfoForm item={item?.data?.data} loading={item.loading} ref={infoFormRef} />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@UPDATE', loading: submitLoading }}
        simpleButtonAction={onUpdateItem}
      />
    </PageCard>
  );
};
