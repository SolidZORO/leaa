import React from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import cx from 'classnames';
import i18n from 'i18next';
import { RiTimeLine } from 'react-icons/ri';
import { FORMAT_DATA, FORMAT_DATA_TIME } from '@leaa/dashboard/src/constants';

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

  const buildDateDom = (date: Date | undefined, type: 'createdAt' | 'updatedAt') => {
    const tipsLabel = i18n.t(`_lang:${type}`);
    const noDataLabel = i18n.t('_lang:noData');

    if (!date) {
      return (
        <Tooltip title={`${tipsLabel} ${noDataLabel}`}>
          <span className={style['empty']}>NULL</span>
        </Tooltip>
      );
    }

    return (
      <Tooltip title={`${tipsLabel}  ${moment(date).format(FORMAT_DATA_TIME)}`}>
        <>{moment(date).format(props.format || FORMAT_DATA)}</>
      </Tooltip>
    );
  };

  return (
    <div
      className={cx(style['entry-info-date-wrapper'], props.className, {
        [style['wrapper--small']]: props.size === 'small',
      })}
    >
      <RiTimeLine />

      {props.date && (
        <div className={style['inner']}>
          <strong>{buildDateDom(props.date[0], 'createdAt')}</strong>
          <span className={style['symbol']}>/</span>
          <strong>{buildDateDom(props.date[1], 'updatedAt')}</strong>
        </div>
      )}
    </div>
  );
};
