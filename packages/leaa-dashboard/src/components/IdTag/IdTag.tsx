import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import { NullTag } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  className?: string;
  id: number | string | undefined | any;
  link?: string;
  icon?: string | React.ReactNode;
  size?: 'small' | 'large';
  linkNormalColor?: boolean;
}

export const IdTag = (props: IProps) => {
  const idInnerDom = (
    <div className={style['id-tag-inner']}>
      {props.icon}
      <sup className={style['id-tag-symbol']}>#</sup>
      <strong className={style['id-tag-text']}>{!props.id ? '_' : props.id}</strong>
    </div>
  );
  const idDom = () => {
    if (props.link && props.id) {
      return <Link to={props.link}>{idInnerDom}</Link>;
    }

    if (props.id) {
      return idInnerDom;
    }

    return <NullTag opacity={0.4} />;
  };

  return (
    <div
      className={cx(
        style['id-tag-wrapper'],
        props.className,
        style[`id-tag-wrapper--size-${props.size}`],
        'g-id-tag-wrapper',
        {
          [style['id-tag-wrapper--empty']]: !props.id,
          [style['id-tag-wrapper--link-normal-color']]: props.linkNormalColor,
        },
      )}
    >
      {idDom()}
    </div>
  );
};
