import React, { useState } from 'react';
import cx from 'classnames';
import { Button } from 'antd';
import { RiRefreshLine } from 'react-icons/ri';

import { TagSyncToFileRes } from '@leaa/api/src/dtos/tag';
import { fetcher } from '@leaa/dashboard/src/libs';
import { msg, httpErrorMsg } from '@leaa/dashboard/src/utils';

import { IHttpRes } from '@leaa/dashboard/src/interfaces';
import { envConfig } from '@leaa/dashboard/src/configs';
import { useTranslation } from 'react-i18next';

import style from './style.module.less';

interface IProps {
  className?: string;
}

export const SyncTagsToFileButton = (props: IProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const onSyncTagsToFile = async () => {
    setLoading(true);

    fetcher
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/tags/sync-tags-to-dict-file`)
      .then((res: IHttpRes<TagSyncToFileRes>) => {
        msg(res?.data?.data?.message);
      })
      .catch(httpErrorMsg)
      .finally(() => setLoading(false));
  };

  return (
    <Button
      className={cx(style['sync-button'], props.className)}
      type="link"
      icon={<RiRefreshLine />}
      onClick={() => onSyncTagsToFile()}
      loading={loading}
    >
      SYNC
    </Button>
  );
};
