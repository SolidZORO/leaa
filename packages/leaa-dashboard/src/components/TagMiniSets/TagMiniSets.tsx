import React, { useState, useEffect } from 'react';
import { Tag } from 'antd';
import { AutoCompleteProps } from 'antd/es/auto-complete';

import { Tag as TagEntry } from '@leaa/api/src/entrys';

import style from './style.module.less';

interface IProps extends AutoCompleteProps {
  className?: string;
  tags?: TagEntry[];
}

export const TagMiniSets = (props: IProps) => {
  const [innerTags, setInnerTags] = useState(props.tags || []);

  useEffect(() => {
    if (props.tags) setInnerTags(props.tags);
  }, [props.tags]);

  if (!innerTags || innerTags.length === 0) return null;

  return (
    <div className={style['tag-mini-sets-wrapper']}>
      <small className={style['col-tags-wrapper']}>
        {innerTags.map((tag) => (
          <Tag key={tag.name} className={style['col-tags-item']}>
            {tag.name}
          </Tag>
        ))}
      </small>
    </div>
  );
};
