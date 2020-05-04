import React from 'react';
import { Popconfirm, Button } from 'antd';
import { ButtonSize } from 'antd/es/button';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { DeleteOutlined, LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { IdTag } from '../IdTag/IdTag';

import style from './style.module.less';

interface IProps {
  id: number | string | undefined;
  fieldName?: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: ButtonSize;
  loading?: boolean;
}

export const TableColumnDeleteButton = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Popconfirm
        overlayClassName={style['popconfirm-wrapper']}
        icon={null}
        title={
          <span className={style['title-wrapper']}>
            {props.loading ? (
              <LoadingOutlined className={style['icon-question']} />
            ) : (
              <QuestionCircleOutlined className={style['icon-question']} />
            )}
            {t('_comp:TableColumnDeleteButton.confirmDeleteItem')} {props.id && <IdTag id={props.id} />}{' '}
            <em>{props.fieldName}</em> ?
          </span>
        }
        placement="topRight"
        onConfirm={props.onClick}
      >
        <Button icon={<DeleteOutlined />} size={props.size || 'small'} />
      </Popconfirm>
    </div>
  );
};
