import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';

import style from './style.module.less';

interface IProps {
  className?: string;
  text?: string;
  opacity?: number;
  scale?: number;
}

export const NullTag = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div
      style={{ opacity: props.opacity || 1 }}
      className={cx(style['null-tag-wrapper'], props.className, 'g-null-tag-wrapper')}
    >
      <Tooltip title={t('_lang:noData')}>
        <div style={{ transform: `scale(${props.scale || 0.9})` }} className={style['null-tag-inner']}>
          {props.text || 'NULL'}
        </div>
      </Tooltip>
    </div>
  );
};
