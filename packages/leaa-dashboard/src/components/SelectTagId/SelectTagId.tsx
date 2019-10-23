import React, { useState, forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Tag, Button, Popover } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';

import { Tag as TagEntry } from '@leaa/common/src/entrys';
import { SelectTagSearchBox } from '@leaa/dashboard/src/components/SelectTagSearchBox/SelectTagSearchBox';
// eslint-disable-next-line max-len
import { QuickCreateTagButton } from '@leaa/dashboard/src/components/SelectTagId/_components/QuickCreateTagButton/QuickCreateTagButton';

import style from './style.less';

interface IProps {
  selectedTagsMaxLength: number;
  selectedTags?: TagEntry[];
  onChangeSelectedTagsCallback?: (tags: TagEntry[]) => void;
  placement?: TooltipPlacement;
  enterCreateTag?: boolean;
}

export const SelectTagId = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  const [selectedTags, setSelectedTags] = useState<TagEntry[]>(props.selectedTags || []);
  const [tagName, setTagName] = useState<string | undefined>();

  const onRemoveTag = (tag: TagEntry) => {
    setSelectedTags(selectedTags.filter(i => i.name !== tag.name));

    return false;
  };

  const onSelectTag = (tag: TagEntry) => {
    if (tag && !selectedTags.map(item => item.name).includes(tag.name)) {
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

        {selectedTags && selectedTags.length < (props.selectedTagsMaxLength || 5) && (
          <Popover
            title={
              <div className={style['popover-title-wrapper']}>
                <div className={style['popover-title-tips']}>
                  {t(`_comp:SelectTagId.canAlsoAddTagsQuantity`, {
                    length: `${props.selectedTagsMaxLength - selectedTags.length}`,
                  })}
                </div>

                <div
                  className={cx(style['popover-title-button'], {
                    [style['popover-title-button--show']]: tagName,
                    [style['popover-title-button--hide']]: !tagName,
                  })}
                >
                  <QuickCreateTagButton tagName={tagName} onCreatedTagCallback={onSelectTag} />
                </div>
              </div>
            }
            content={
              <div className={style['popover-content-wrapper']}>
                <SelectTagSearchBox
                  // autoFocus
                  onSelectTagCallback={onSelectTag}
                  enterCreateTag={props.enterCreateTag}
                  onChangeTagNameCallback={setTagName}
                />
              </div>
            }
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
