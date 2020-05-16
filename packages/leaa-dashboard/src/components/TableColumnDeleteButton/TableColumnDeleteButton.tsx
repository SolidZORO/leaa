import React, { useState } from 'react';
import { Popconfirm, Button } from 'antd';
import { ButtonSize } from 'antd/es/button';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { DeleteOutlined, LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { ajax, errorMsg, msg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { AxiosResponse, AxiosError } from 'axios';
import { ICrudDeleteData, ICrudError } from '@leaa/dashboard/src/interfaces';

import { IdTag } from '../IdTag/IdTag';

import style from './style.module.less';

interface IProps {
  routerName: string;
  id: number | string | undefined;
  fieldName?: React.ReactNode;
  size?: ButtonSize;
  onChange?: () => void;
  onSuccessCallback?: () => void;
  className?: string;
}

export const TableColumnDeleteButton = (props: IProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const onChange = () => {
    setLoading(true);

    ajax
      .delete(`${envConfig.API_URL}/${props.routerName}/${props.id}`)
      .then((res: AxiosResponse<ICrudDeleteData<any>>) => {
        msg(t('_lang:deletedSuccessfully', { id: res?.data?.id }));

        if (props.onSuccessCallback) props.onSuccessCallback();
      })
      .catch((err: AxiosError<ICrudError>) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));

    if (props.onChange) props.onChange();
  };

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Popconfirm
        overlayClassName={style['popconfirm-wrapper']}
        icon={null}
        title={
          <span className={style['title-wrapper']}>
            {loading ? (
              <LoadingOutlined className={style['icon-question']} />
            ) : (
              <QuestionCircleOutlined className={style['icon-question']} />
            )}
            {t('_comp:TableColumnDeleteButton.confirmDeleteItem')} {props.id && <IdTag id={props.id} />}{' '}
            {props.fieldName ? <em>{props.fieldName} ?</em> : null}
          </span>
        }
        placement="topRight"
        onConfirm={onChange}
      >
        <Button icon={<DeleteOutlined />} size={props.size || 'small'} loading={loading} />
      </Popconfirm>
    </div>
  );
};
