import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import _ from 'lodash';
import { Input } from 'antd';
import { Tag as TagEntry } from '@leaa/common/src/entrys';
import { TagsWithPaginationObject, TagArgs } from '@leaa/common/src/dtos/tag';
import { GET_TAGS } from '@leaa/common/src/graphqls';
import { apolloClient } from '@leaa/dashboard/src/libs';
import { QuickCreateTagButton } from './_components/QuickCreateTagButton/QuickCreateTagButton';

import style from './style.less';

interface IProps {
  onSelectTagCallback?: (tag: TagEntry) => void;
  onSearchCallback?: (tag: string) => void;
  className?: string;
  useOnBlur?: boolean;
}

const DEBOUNCE_MS = 500;

export const SelectTagSearchBox = (props: IProps) => {
  const { t } = useTranslation();

  const [searchTimes, setSearchTimes] = useState<number>(0);
  const [lastSearchKey, setLastSearchKey] = useState<string>();
  const [optionalTags, setOptionalTags] = useState<TagEntry[]>([]);
  const [showOptionalTags, setShowOptionalTags] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const queryTags = useRef(
    _.debounce((v: string) => {
      if (!v) {
        setLastSearchKey(undefined);
      }

      if (v === lastSearchKey) {
        return;
      }

      setSearchTimes(searchTimes + 1);
      setLoading(true);
      setLastSearchKey(v);
      setOptionalTags([]);

      apolloClient
        .query<{ tags: TagsWithPaginationObject }, TagArgs>({
          query: GET_TAGS,
          variables: { page: 1, pageSize: 10, q: v },
          fetchPolicy: 'network-only',
        })
        .then((result: { data: { tags: TagsWithPaginationObject } }) => {
          if (result && result.data.tags && result.data.tags.items) {
            setOptionalTags(result.data.tags.items);
          }

          console.log('setShowOptionalTags');
          setShowOptionalTags(true);
        })
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS),
  );

  const onQueryTags = (tag: string) => queryTags.current(tag);

  const onSelectTag = (tag: TagEntry) => {
    if (props.onSelectTagCallback) {
      props.onSelectTagCallback(tag);
    }
  };

  const onCreatedTagCallback = (tag: TagEntry) => {
    setOptionalTags([tag]);
    onSelectTag(tag);
  };

  const onSearch = (e: any) => {
    if (props.onSearchCallback) {
      props.onSearchCallback(e.currentTarget.value);
    }
  };

  useEffect(() => {
    return () => {
      setLoading(false);
      setLastSearchKey(undefined);
      setOptionalTags([]);
    };
  }, []);

  return (
    <div className={style['wrapper']}>
      <div className={cx(style['container'], props.className)}>
        <Input
          // loading={loading.toString()}
          allowClear
          placeholder={t(`_comp:SelectTagId.searchTags`)}
          onChange={e => onQueryTags(e.currentTarget.value)}
          onFocus={() => {
            setShowOptionalTags(true);

            if (searchTimes === 0) {
              onQueryTags('');
            }
          }}
          onPressEnter={onSearch}
          onBlur={() => props.useOnBlur && setTimeout(() => setShowOptionalTags(false), 200)}
        />

        <div
          className={cx(style['tag-optional-wrapper'], {
            [style['tag-optional-wrapper--show']]: showOptionalTags,
            [style['tag-optional-wrapper--hide']]: !showOptionalTags,
          })}
        >
          {lastSearchKey && optionalTags.length === 0 ? (
            <div className={style['tag-optional-empty']}>{t(`_comp:SelectTagId.notFoundTags`)}</div>
          ) : (
            optionalTags.map(tag => (
              <div key={tag.name} onClick={() => onSelectTag(tag)} className={style['tag-optional-item']}>
                {tag.name}
              </div>
            ))
          )}

          {lastSearchKey && (
            <div className={style['tag-quick-create-wrapper']}>
              <QuickCreateTagButton tagName={lastSearchKey} onCreatedTagCallback={tag => onCreatedTagCallback(tag)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
