import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';

import { Attachment } from '@leaa/api/src/entrys';
import { IPage, IFetchRes } from '@leaa/dashboard/src/interfaces';
import { formatAttaUrl, httpErrorMsg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { useSWR } from '@leaa/dashboard/src/libs';

import { PageCard, HtmlMeta } from '@leaa/dashboard/src/components';

import style from './style.module.less';

const API_PATH = 'attachments';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const item = useSWR<IFetchRes<Attachment>>(
    { url: `${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}` },
    { onError: httpErrorMsg },
  );

  return (
    <PageCard route={props.route} title="@VIEW-ONLY" className={style['page-card-wapper']} loading={item.loading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <div className={style['image-wrapper']}>
        <img src={`${formatAttaUrl(item?.data?.data.url)}`} alt="" />

        <div className={style['info']}>
          <Input.TextArea rows={10} value={JSON.stringify(item)} />
        </div>
      </div>
    </PageCard>
  );
};
