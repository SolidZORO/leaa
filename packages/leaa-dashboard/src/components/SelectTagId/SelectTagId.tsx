import React, { useState, forwardRef, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Tag, Button, Popover } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';

import { Tag as TagEntry } from '@leaa/common/src/entrys';
import { TagSearchBox, Rcon } from '@leaa/dashboard/src/components';

import { envConfig } from '@leaa/dashboard/src/configs';
import { ajax } from '@leaa/dashboard/src/utils';
import { IHttpRes, IHttpError, ICommenFormRef } from '@leaa/dashboard/src/interfaces';

import style from './style.module.less';

interface IProps {
  maxSelectedSize: number;
  selectedTags?: TagEntry[];
  onChangeSelectedTagsCallback?: (tags: TagEntry[]) => void;
  placement?: TooltipPlacement;
}

export const SelectTagId = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  const [selectedTags, setSelectedTags] = useState<TagEntry[]>(props.selectedTags || []);
  const [selectTag, setSelectTag] = useState<TagEntry>();
  const [tagName, setTagName] = useState<string | undefined>();

  const tagSearchBoxRef = useRef<any>(null);

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

  const onCreateTag = async (name?: string) => {
    if (!name) return;

    ajax
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/tags`, { name })
      .then((res: IHttpRes<TagEntry>) => {
        console.log('onCreateTag Done', res.data?.data);

        onSelectTag(res.data?.data);
        setTagName('');
        tagSearchBoxRef.current.focus();
      })
      .catch((err: IHttpError) => {
        console.error('onCreateTag Error - M', err.response?.data?.message);
        console.error('onCreateTag Error - R', err.response);
        setTagName('');
        tagSearchBoxRef.current.focus();
      });
  };

  useEffect(() => {
    if (props.onChangeSelectedTagsCallback) {
      props.onChangeSelectedTagsCallback(selectedTags);
    }
  }, [props, selectedTags]);

  // warning tag-selected-item exist
  useEffect(() => {
    setTimeout(() => setSelectTag(undefined), 1100);
  }, [selectTag]);

  useEffect(() => {
    if (props.selectedTags) setSelectedTags(props.selectedTags);
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

        {selectedTags && selectedTags.length < (props.maxSelectedSize || 5) && (
          <Popover
            title={
              <div className={style['popover-title-wrapper']}>
                <div className={style['popover-title-tips']}>
                  {t('_comp:SelectTagId.canAlsoAddTagsQuantity', {
                    length: `${props.maxSelectedSize - selectedTags.length}`,
                  })}
                </div>

                <div
                  className={cx(style['popover-title-button'], {
                    [style['popover-title-button--show']]: tagName,
                    [style['popover-title-button--hide']]: !tagName,
                  })}
                >
                  <div className={cx(style['wrapper'])}>
                    <Button onClick={() => onCreateTag(tagName)} size="small">
                      {t('_comp:SelectTagId.createAndAdd')}
                    </Button>
                  </div>
                </div>
              </div>
            }
            content={
              <div className={style['popover-content-wrapper']}>
                <TagSearchBox
                  autoFocus
                  onSelectTagCallback={onSelectTag}
                  onChangeTagNameCallback={setTagName}
                  selectedTagsSize={selectedTags.length}
                  ref={tagSearchBoxRef}
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
