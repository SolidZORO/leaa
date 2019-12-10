import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import { Options } from 'currency.js';
import { ParsedQuery } from 'query-string';

import { Rcon } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps extends Options {
  urlParams: ParsedQuery;
  onClose: () => void;
}

export const FilterIcon = (props: IProps) => {
  let showClose = false;

  if (!_.isEmpty(props.urlParams)) {
    showClose = !_.isEmpty(_.omit(props.urlParams, ['page', 'pageSize', 'orderBy', 'orderSort']));
  }

  return (
    <Rcon
      className={cx(style['filter-bar-icon'], { [style['filter-bar-icon--show-close']]: showClose })}
      type={showClose ? 'ri-close-circle-line' : 'ri-filter-line'}
      onClick={showClose ? props.onClose : undefined}
    />
  );
};
