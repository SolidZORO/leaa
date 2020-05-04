import React, { useState, forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Tag, Button, Popover } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';

import { Tag as TagEntry } from '@leaa/common/src/entrys';
import { TagSearchBox, Rcon } from '@leaa/dashboard/src/components';

import { QuickCreateTagButton } from './_components/QuickCreateTagButton/QuickCreateTagButton';

import style from './style.module.less';

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
  const [selectTag, setSelectTag] = useState<TagEntry>();
  const [tagName, setTagName] = useState<string | undefined>();

  const onRemoveTag = (tag: TagEntry) => {
    setSelectedTags(selectedTags.filter((i) => i.name !== tag.name));

    return false;
  };

  const onSelectTag = (tag: TagEntry) => {
    setSelectTag(tag);

    if (tag && !selectedTags.map((item) => item.name).includes(tag.name)) {
      setSelectTag(undefined);
      setSelectedTags(selectedTags.concat(tag));
    }
  };

  useEffect(() => {
    if (props.onChangeSelectedTagsCallback) {
      props.onChangeSelectedTagsCallback(selectedTags);
    }
  }, [selectedTags]);

  // warning tag-selected-item exist
  useEffect(() => {
    setTimeout(() => setSelectTag(undefined), 1100);
  }, [selectTag]);

  useEffect(() => {
    if (props.selectedTags) {
      setSelectedTags(props.selectedTags);
    }
  }, [props.selectedTags]);

  return (
    <div className={cx(style['wrapper'])}>
      <div className={style['tag-selected-wrapper']} ref={ref}>
        {selectedTags &&
          selectedTags.map((tag) => (
            <Tag
              key={tag.name}
              closable
              onClose={() => onRemoveTag(tag)}
              className={cx(style['tag-selected-item'], {
                [style['tag-selected-item--exist']]: tag.name === (selectTag && selectTag.name),
              })}
            >
              {tag.name}
            </Tag>
          ))}

        {selectedTags && selectedTags.length < (props.selectedTagsMaxLength || 5) && (
          <Popover
            title={
              <div className={style['popover-title-wrapper']}>
                <div className={style['popover-title-tips']}>
                  {t('_comp:SelectTagId.canAlsoAddTagsQuantity', {
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
                <TagSearchBox
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
            <Button size="small" icon={<Rcon type="ri-plus-line" />} className={style['add-tag-button']}>
              {t('_comp:SelectTagId.addTag')}
            </Button>
          </Popover>
        )}
      </div>
    </div>
  );
});
