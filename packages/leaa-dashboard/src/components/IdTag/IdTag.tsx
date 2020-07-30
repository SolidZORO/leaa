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
  width?: number; // show id width
}

const DEFAULT_WIDTH = 4;

export const IdTag = (props: IProps) => {
  // if id, show all, if uuid, show 4
  let idStr = `${props.id}`.includes('-') ? props.id.substr(0, DEFAULT_WIDTH) : props.id;

  if (props.width && props.width !== DEFAULT_WIDTH && `${props.id}`.includes('-')) {
    idStr = props.id.substr(0, props.width);
  }

  const idInnerDom = (
    <div className={style['id-tag-inner']}>
      {props.icon}
      <sup className={style['id-tag-symbol']}>#</sup>
      <strong className={style['id-tag-text']}>{!props.id ? '_' : idStr}</strong>
    </div>
  );
  const idDom = () => {
    if (props.link && props.id) {
      return <Link to={props.link}>{idInnerDom}</Link>;
    }

    if (props.id) return idInnerDom;

    return <NullTag opacity={0.4} />;
  };

  return (
    <div
      className={cx(
        style['id-tag-comp-wrapper'],
        props.className,
        style[`id-tag-comp-wrapper--size-${props.size}`],
        'g-id-tag-wrapper',
        {
          [style['id-tag-comp-wrapper--empty']]: !props.id,
          [style['id-tag-comp-wrapper--link-normal-color']]: props.linkNormalColor,
        },
      )}
    >
      {idDom()}
    </div>
  );
};
