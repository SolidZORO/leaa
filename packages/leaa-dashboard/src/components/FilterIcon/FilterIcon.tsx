import React from 'react';
import _ from 'lodash';
import { Options } from 'currency.js';
import { ParsedQuery } from 'query-string';

import { Rcon } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps extends Options {
  urlParams: ParsedQuery;
  onClose: () => void;
}

export const FilterIcon = (props: IProps) => {
  return _.isEmpty(props.urlParams) ? (
    <Rcon type="ri-filter-line" className={style['filter-bar-icon']} />
  ) : (
    <Rcon type="ri-close-circle-line" className={style['filter-bar-icon']} onClick={props.onClose} />
  );
};
