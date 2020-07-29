import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';

import { Attachment } from '@leaa/api/src/entrys';
import { IPage, IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { errorMsg, formatAttaUrl } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { fetcher } from '@leaa/dashboard/src/libs';

import { PageCard, HtmlMeta } from '@leaa/dashboard/src/components';

import style from './style.module.less';

const API_PATH = 'attachments';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const [item, setItem] = useState<Attachment | undefined>();
  const [itemLoading, setItemLoading] = useState(false);

  const onFetchItem = () => {
    setItemLoading(true);

    fetcher
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`)
      .then((res: IHttpRes<Attachment>) => {
        setItem(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setItemLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onFetchItem(), []);

  return (
    <PageCard route={props.route} title="@VIEW-ONLY" className={style['wapper']} loading={itemLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <div className={style['image-wrapper']}>
        <img src={`${formatAttaUrl(item?.url)}`} alt="" />

        <div className={style['info']}>
          <Input.TextArea rows={10} value={JSON.stringify(item)} />
        </div>
      </div>
    </PageCard>
  );
};
