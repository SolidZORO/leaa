import React from 'react';
import cx from 'classnames';

import { IdTag } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  id: string;
  className?: string;
  link?: string;
}

export const TableColumnId = (props: IProps) => {
  return (
    <div className={cx(style['table-column-id-comp-wrapper'], props.className)}>
      <IdTag id={props.id} size="small" linkNormalColor link={props.link} />
    </div>
  );
};
