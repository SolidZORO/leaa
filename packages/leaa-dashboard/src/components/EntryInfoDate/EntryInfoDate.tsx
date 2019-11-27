import React from 'react';
import moment from 'moment';
import { Tooltip, Icon } from 'antd';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import style from './style.module.less';

interface IProps {
  date?: (Date | undefined)[];
  size?: 'small';
  format?: string;
  className?: string;
}

export const EntryInfoDate = (props: IProps) => {
  if (!props.date) {
    return null;
  }

  const { t } = useTranslation();

  const LABEL_FORMAT = props.format || 'YYYY-MM-DD';
  const TOOLTIP_FORMAT = 'YYYY-MM-DD HH:mm:ss';

  const buildDateDom = (date: Date | undefined, type: 'created_at' | 'updated_at') => {
    const tipsLabel = t(`_lang:${type}`);
    const noDataLabel = t('_lang:noData');

    if (!date) {
      return (
        <Tooltip title={`${tipsLabel} ${noDataLabel}`}>
          <span className={style['empty']}>NULL</span>
        </Tooltip>
      );
    }

    return (
      <Tooltip title={`${tipsLabel}  ${moment(date).format(TOOLTIP_FORMAT)}`}>
        {moment(date).format(LABEL_FORMAT)}
      </Tooltip>
    );
  };

  return (
    <div
      className={cx(style['wrapper'], props.className, {
        [style['wrapper--small']]: props.size === 'small',
      })}
    >
      <Icon type="x-time-info" />

      {props.date && (
        <div className={style['inner']}>
          <strong>{buildDateDom(props.date[0], 'created_at')}</strong>
          <span className={style['symbol']}>/</span>
          <strong>{buildDateDom(props.date[1], 'updated_at')}</strong>
        </div>
      )}
    </div>
  );
};
