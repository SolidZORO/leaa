import React from 'react';
import { Popconfirm, Button, Icon, Tag } from 'antd';
import { ButtonSize } from 'antd/lib/button';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import style from './style.module.less';

interface IProps {
  id: React.ReactNode;
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
        icon={<Icon type={props.loading ? 'loading' : 'question-circle'} className={style['icon-question']} />}
        title={
          <span>
            {t('_comp:TableColumnDeleteButton.confirmDeleteItem')}{' '}
            {props.id && (
              <>
                <sup>#</sup>
                {props.id}
              </>
            )}{' '}
            {props.fieldName && <Tag color="geekblue">{props.fieldName}</Tag>} ?
          </span>
        }
        placement="topRight"
        onConfirm={props.onClick}
      >
        <Button icon="delete" size={props.size || 'small'} />
      </Popconfirm>
    </div>
  );
};
