import React from 'react';
import cx from 'classnames';
import currency, { Options } from 'currency.js';

import { getLocalStorageSettings } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps extends Options {
  className?: string;
  amount: number | undefined;
  size?: 'small' | 'large';
  precision?: number;
}

export const PriceTag = (props: IProps) => {
  const symbol = props.symbol || getLocalStorageSettings({ key: 'currency_symbol' }).value;
  const amount = currency(props.amount || 0, { symbol, precision: props.precision || 2 });

  return (
    <div
      className={cx(style['price-tag-comp-wrapper'], props.className, 'g-price-tag-comp-wrapper', {
        [style[`price-tag-comp-wrapper--${props.size}`]]: props.size,
      })}
    >
      <span className={cx(style['price-tag-symbol'], 'g-price-tag-symbol')}>{symbol}</span>
      <span className={cx(style['price-tag-amount'], 'g-price-tag-amount')}>{amount.format()}</span>
    </div>
  );
};
