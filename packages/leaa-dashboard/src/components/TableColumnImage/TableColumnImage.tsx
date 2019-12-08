import React from 'react';
import cx from 'classnames';

import emptyProductImage from '@leaa/dashboard/src/assets/images/empty/empty-product.png';

import style from './style.module.less';

interface IProps {
  url?: string | undefined | null;
  width?: number;
  className?: string;
  link?: string;
}

export const TableColumnImage = (props: IProps) => {
  const src = props.url || emptyProductImage;
  const width = props.width || 48;

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <img src={src} alt="" className={style['image']} width={width} height={width} />
    </div>
  );
};
