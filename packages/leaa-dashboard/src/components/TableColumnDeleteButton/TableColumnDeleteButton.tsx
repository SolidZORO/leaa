import React, { useState } from 'react';
import { Popconfirm, Button } from 'antd';
import { ButtonSize } from 'antd/es/button';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { LoadingOutlined } from '@ant-design/icons';
import { RiDeleteBin7Line, RiQuestionLine } from 'react-icons/ri';

import { ajax, errorMsg, msg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpError, IHttpRes } from '@leaa/dashboard/src/interfaces';

import { IdTag } from '../IdTag/IdTag';

import style from './style.module.less';

interface IProps {
  apiPath: string;
  id: number | string | undefined;
  tipsTitle?: React.ReactNode;
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
      .delete(`${envConfig.API_URL}/${envConfig.API_VERSION}/${props.apiPath}/${props.id}`)
      .then((res: IHttpRes<{ id: number | string }>) => {
        msg(t('_lang:deletedSuccessfully', { id: res?.data?.data?.id }));

        if (props.onSuccessCallback) props.onSuccessCallback();
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));

    if (props.onChange) props.onChange();
  };

  return (
    <div className={cx(style['table-column-delete-button-wrapper'], props.className)}>
      <Popconfirm
        overlayClassName={style['popconfirm-wrapper']}
        icon={null}
        title={
          <span className={style['title-wrapper']}>
            {loading ? <LoadingOutlined spin /> : <RiQuestionLine color="red" />}
            {t('_comp:TableColumnDeleteButton.confirmDeleteItem')} {props.id && <IdTag id={props.id} />}{' '}
            {props.tipsTitle ? <em>{props.tipsTitle} ?</em> : null}
          </span>
        }
        placement="topRight"
        onConfirm={onChange}
      >
        <Button icon={<RiDeleteBin7Line />} size={props.size} loading={loading} />
      </Popconfirm>
    </div>
  );
};
