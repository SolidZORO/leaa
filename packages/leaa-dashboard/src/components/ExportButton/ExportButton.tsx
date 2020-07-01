import React, { useState } from 'react';
import axios from 'axios';
import cx from 'classnames';
import moment from 'moment';
import { RiDownload2Line } from 'react-icons/ri';

import { Button, message } from 'antd';
import { ButtonSize } from 'antd/es/button';
import { useTranslation } from 'react-i18next';

import { envConfig } from '@leaa/dashboard/src/configs';
import { getAuthToken } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps {
  moduleName: string;
  onClick?: () => void;
  params?: Record<string, unknown>;
  size?: ButtonSize;
  className?: string;
}

export const ExportButton = (props: IProps) => {
  const { t } = useTranslation();
  const exportUrlBase = `${envConfig.API_URL}/${envConfig.API_VERSION}/export`;
  const exportUrl = `${exportUrlBase}/${props.moduleName}`;
  const token = getAuthToken();

  const [loading, setLoading] = useState<boolean>(false);

  const onExport = () => {
    setLoading(true);

    return axios({
      url: exportUrl,
      method: 'POST',
      responseType: 'blob',
      headers: { Authorization: token ? `Bearer ${token}` : '' },
      data: props.params,
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${props.moduleName}-${moment().format('YYYYMMDD-HHmmss')}.xlsx`);
        document.body.appendChild(link);
        link.click();

        setLoading(false);
      })
      .catch((err: Error) => {
        message.info(err.message);

        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={cx(style['export-button-wrapper'], props.className)}>
      <Button
        size={props.size}
        icon={<RiDownload2Line />}
        onClick={onExport}
        loading={loading}
        className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--export')}
      >
        {t('_lang:export')}
      </Button>
    </div>
  );
};
