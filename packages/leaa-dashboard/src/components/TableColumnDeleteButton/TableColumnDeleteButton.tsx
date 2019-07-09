import React from 'react';
import { Popconfirm, Button, Icon } from 'antd';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import style from './style.less';

interface IProps {
  id: number;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
}

export const TableColumnDeleteButton = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Popconfirm
        icon={<Icon type={props.loading ? 'loading' : 'question-circle'} style={{ color: '#ff003d' }} />}
        title={
          <span>
            {t('_comp:TableColumnDeleteButton.confirmDeleteItem')} #{props.id} ?
          </span>
        }
        placement="topRight"
        onConfirm={props.onClick}
      >
        <Button icon="delete" size="small" />
      </Popconfirm>
    </div>
  );
};
