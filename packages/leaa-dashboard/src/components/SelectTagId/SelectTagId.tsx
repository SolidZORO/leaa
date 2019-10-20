import React, { useState, forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Tag, Button, Popover } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';

import { Tag as TagEntry } from '@leaa/common/src/entrys';
import { SelectTagSearchBox } from './_components/SelectTagSearchBox/SelectTagSearchBox';

import style from './style.less';

interface IProps {
  selectedTags?: TagEntry[];
  onChangeSelectedTagsCallback?: (tags: TagEntry[]) => void;
  placement?: TooltipPlacement;
  selectedTagsLength?: number;
}

export const SelectTagId = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  const [selectedTags, setSelectedTags] = useState<TagEntry[]>(props.selectedTags || []);

  const onRemoveTag = (tag: TagEntry) => {
    setSelectedTags(selectedTags.filter(i => i.name !== tag.name));

    return false;
  };

  const onSelectTag = (tag: TagEntry) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.concat(tag));
    }
  };

  useEffect(() => {
    if (props.onChangeSelectedTagsCallback) {
      props.onChangeSelectedTagsCallback(selectedTags);
    }
  }, [selectedTags]);

  useEffect(() => {
    if (props.selectedTags) {
      setSelectedTags(props.selectedTags);
    }
  }, [props.selectedTags]);

  return (
    <div className={cx(style['wrapper'])}>
      <div className={style['tag-selected-wrapper']} ref={ref}>
        {selectedTags &&
          selectedTags.map(tag => (
            <Tag key={tag.name} closable className={style['tag-selected-item']} onClose={() => onRemoveTag(tag)}>
              {tag.name}
            </Tag>
          ))}

        {selectedTags && selectedTags.length < (props.selectedTagsLength || 5) && (
          <Popover
            content={<SelectTagSearchBox onSelectTagCallback={onSelectTag} />}
            trigger="click"
            placement={props.placement || 'bottomLeft'}
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
});
