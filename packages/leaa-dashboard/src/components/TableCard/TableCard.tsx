import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import style from './style.module.less';

interface IProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  loading?: boolean;
  selectedRowBar?: React.ReactNode;
  selectedRowKeys?: string[] | number[];
}

export const TableCard = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(
        style['wrapper'],
        { [style['selected-row-bar']]: props.selectedRowKeys && props.selectedRowKeys.length > 0 },
        props.className,
      )}
    >
      <div className={style['container']}>
        {props.children}

        {props.selectedRowKeys && props.selectedRowKeys.length > 0 && (
          <div className={cx(style['selected-row-bar-wrapper'])}>
            <div className={style['selected-row-bar-container']}>
              <div className={style['total']}>
                {props.selectedRowKeys.length} {t('_lang:selected')}
              </div>
              <div className={style['tools']}>{props.selectedRowBar}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
