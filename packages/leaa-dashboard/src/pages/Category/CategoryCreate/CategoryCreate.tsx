import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Category } from '@leaa/api/src/entrys';
import { CategoryUpdateOneReq } from '@leaa/api/src/dtos/category';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes } from '@leaa/dashboard/src/interfaces';
import { fetcher } from '@leaa/dashboard/src/libs';
import { msg, httpErrorMsg } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

import { CategoryInfoForm } from '../_components/CategoryInfoForm/CategoryInfoForm';

import style from './style.module.less';

const API_PATH = 'categories';

export default (props: IPage) => {
  const { t } = useTranslation();

  const infoFormRef = useRef<ICommenFormRef<CategoryUpdateOneReq>>(null);

  const [submitLoading, setSubmitLoading] = useState(false);

  const onCreateItem = async () => {
    const infoData: ISubmitData<CategoryUpdateOneReq> = await infoFormRef.current?.onValidateForm();
    if (!infoData) return;

    const data: ISubmitData<CategoryUpdateOneReq> = infoData;
    setSubmitLoading(true);

    fetcher
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, data)
      .then((res: IHttpRes<Category>) => {
        msg(t('_lang:createdSuccessfully'));

        props.history.push(`/${API_PATH}/${res.data.data?.id}`);
      })
      .catch(httpErrorMsg)
      .finally(() => setSubmitLoading(false));
  };

  return (
    <PageCard route={props.route} title="@CREATE" className={style['page-card-wapper']} loading={submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <CategoryInfoForm ref={infoFormRef} />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@CREATE', loading: submitLoading }}
        simpleButtonAction={onCreateItem}
      />
    </PageCard>
  );
};
