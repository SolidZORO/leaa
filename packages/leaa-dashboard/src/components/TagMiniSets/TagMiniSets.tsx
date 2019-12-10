import React from 'react';
import { Tag } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';

import { Tag as TagEntry } from '@leaa/common/src/entrys';

import style from './style.module.less';

interface IProps extends AutoCompleteProps {
  className?: string;
  tags?: TagEntry[];
}

export const TagMiniSets = (props: IProps) => {
  if (!props.tags || (props.tags && props.tags.length > 0)) return null;

  return (
    <div className={style['wrapper']}>
      {props.tags && props.tags?.length > 0 && (
        <small className={style['col-tags-wrapper']}>
          {props.tags.map(tag => (
            <Tag key={tag.name} className={style['col-tags-item']}>
              {tag.name}
            </Tag>
          ))}
        </small>
      )}
    </div>
  );
};
