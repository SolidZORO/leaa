import cx from 'classnames';
import { AxiosResponse, AxiosError } from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, message } from 'antd';
import { SwitchSize } from 'antd/es/switch';

import { ajax, errorMsg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { ICurdDeleteData, ICurdError } from '@leaa/dashboard/src/interfaces';

import style from './style.module.less';

interface IProps {
  routerName: string;
  id: string;
  value?: number;
  size?: SwitchSize;
  onSuccessCallback?: () => void;
  className?: string;
}

export const TableColumnStatusSwitch = (props: IProps) => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<boolean>(Boolean(props.value));
  const [loading, setLoadin] = useState(false);

  const onChange = (v: boolean) => {
    setLoadin(true);

    ajax
      .put(`${envConfig.API_URL}/${props.routerName}/${props.id}`, { status: Number(v) })
      .then((res: AxiosResponse<ICurdDeleteData<any>>) => {
        setStatus(Boolean(res.data.status));

        message.success(
          <span>
            {t('_comp:TableColumnStatusSwitch.updatedSuccessfully', { id: props.id })}
            <Switch checked={Boolean(res.data.status)} size="small" className={style['tips-switch']} />
          </span>,
        );

        if (props.onSuccessCallback) props.onSuccessCallback();
      })
      .catch((err: AxiosError<ICurdError>) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setLoadin(false));
  };

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Switch checked={status} onChange={onChange} size={props.size} loading={loading} />
    </div>
  );
};
