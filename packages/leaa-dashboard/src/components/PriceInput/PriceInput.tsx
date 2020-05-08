import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { InputNumber } from 'antd';
import { InputNumberProps } from 'antd/es/input-number';

import { getLocalStorageSettings } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps extends InputNumberProps {}

export const PriceInput = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(style['price-input-wrapper'], 'g-price-input-wrapper', {
        [style[`price-input-wrapper--${props.size}`]]: props.size,
      })}
    >
      <span className={style['currency-symbol']}>
        {getLocalStorageSettings({ key: 'currency_symbol', disableNotification: true }).value ||
          'CURRENCY_SYMBOL_NOT_SETTING'}
      </span>
      <InputNumber className="g-input-number" placeholder={t('_lang:price')} {...props} />
    </div>
  );
};
