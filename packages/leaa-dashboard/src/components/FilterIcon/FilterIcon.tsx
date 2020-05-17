import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import _ from 'lodash';

import { Rcon } from '@leaa/dashboard/src/components';
import { ICrudListQueryParams } from '@leaa/dashboard/src/interfaces';
import { DEFAULT_QUERY } from '@leaa/dashboard/src/constants';

import style from './style.module.less';

interface IProps {
  crudQuery?: ICrudListQueryParams | any;
  clear?: string[];
  onClose: (clearCondition: any) => void;
}

export const FilterIcon = (props: IProps) => {
  const [showClose, setShowClose] = useState(false);

  const onClose = () => {
    if (!showClose || !props.clear) return;

    const clearQ = props.clear.reduce((attrs: any, cur: any) => {
      // eslint-disable-next-line no-param-reassign
      attrs[cur] = undefined;

      return attrs;
    }, DEFAULT_QUERY);

    if (props.onClose) props.onClose(clearQ);
  };

  useEffect(() => {
    if (props.crudQuery && props.clear) {
      const prevQueryObj = _.pick(props.crudQuery, props.clear);

      setShowClose(JSON.stringify(prevQueryObj) !== '{}');
    }
  }, [props.crudQuery]);

  return (
    <Rcon
      className={cx(style['filter-bar-icon'], { [style['filter-bar-icon--show-close']]: showClose })}
      type={showClose ? 'ri-close-circle-line' : 'ri-filter-line'}
      onClick={onClose}
    />
  );
};
