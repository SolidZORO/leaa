import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import _ from 'lodash';

import { Rcon } from '@leaa/dashboard/src/components';
import { ICrudQueryParams } from '@leaa/dashboard/src/interfaces';
import { DEFAULT_QUERY } from '@leaa/dashboard/src/constants';

import style from './style.module.less';

interface IProps {
  query?: ICrudQueryParams | any;
  clearQuery?: string[];
  onClose: (clearQuery: any) => void;
}

export const FilterIcon = (props: IProps) => {
  const [showClose, setShowClose] = useState(false);

  const onClose = () => {
    if (!showClose || !props.clearQuery) return;

    const clearQ = props.clearQuery.reduce((attrs: any, cur: any) => {
      // eslint-disable-next-line no-param-reassign
      attrs[cur] = undefined;

      return attrs;
    }, DEFAULT_QUERY);

    if (props.onClose) props.onClose(clearQ);
  };

  useEffect(() => {
    if (props.query && props.clearQuery) {
      // const ignoreQuery = ['sort'];
      // const queryObj = _.pick(_.omit(props.query, ignoreQuery), props.clearQuery);
      const queryObj = _.pick(props.query, props.clearQuery);

      setShowClose(JSON.stringify(queryObj) !== '{}');
    }
  }, [props.query]);

  return (
    <Rcon
      className={cx(style['filter-bar-icon'], { [style['filter-bar-icon--show-close']]: showClose })}
      type={showClose ? 'ri-close-circle-line' : 'ri-filter-line'}
      onClick={onClose}
    />
  );
};
