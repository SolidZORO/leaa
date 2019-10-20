import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Tag, Button, Popover } from 'antd';

import { Tag as TagEntry } from '@leaa/common/src/entrys';
import { SelectTagSearchBox } from './_components/SelectTagSearchBox/SelectTagSearchBox';

import style from './style.less';

interface IProps {}

export const SelectTagId = (props: IProps) => {
  const { t } = useTranslation();

  const [selectedTags, setSelectedTags] = useState<TagEntry[]>([]);

  const onRemoveTag = (tag: TagEntry) => {
    setSelectedTags(selectedTags.filter(i => i.name !== tag.name));

    return false;
  };

  const onSelectTag = (tag: TagEntry) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.concat(tag));
    }
  };

  return (
    <div className={cx(style['wrapper'])}>
      <div className={style['tag-selected-wrapper']}>
        {selectedTags &&
          selectedTags.map(tag => (
            <Tag key={tag.name} closable className={style['tag-selected-item']} onClose={() => onRemoveTag(tag)}>
              {tag.name}
            </Tag>
          ))}

        {selectedTags && selectedTags.length < 3 && (
          <Popover
            content={<SelectTagSearchBox onSelectTagCallback={onSelectTag} />}
            trigger="click"
            placement="bottomLeft"
            overlayClassName={style['popover-overlay']}
          >
            <Button size="small" icon="plus" className={style['add-tag-button']}>
              {t(`_comp:SelectTagId.addTag`)}
            </Button>
          </Popover>
        )}
      </div>
    </div>
  );
};
