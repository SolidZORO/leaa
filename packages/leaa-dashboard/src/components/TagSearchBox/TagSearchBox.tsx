import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect, forwardRef, useCallback, useRef } from 'react';
import { AutoCompleteProps } from 'antd/es/auto-complete';
import { CreateQueryParams } from '@nestjsx/crud-request';
import { AutoComplete } from 'antd';

import { Tag as TagEntry } from '@leaa/api/src/entrys';
import { fetcher } from '@leaa/dashboard/src/libs';
import { httpErrorMsg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes, ICrudListRes } from '@leaa/dashboard/src/interfaces';

import style from './style.module.less';

interface IProps extends AutoCompleteProps {
  className?: string;
  useOnBlur?: boolean;
  value?: string;
  autoFocus?: boolean;
  onSelectTagCallback?: (tag: TagEntry) => void;
  onChangeTagNameCallback?: (tag?: string) => void;
  selectedTagsSize?: number;
}

const DEBOUNCE_MS = 300;

export const TagSearchBox = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const isAjaxCancelled = useRef(false);

  const [inputKey, setInputKey] = useState<string | undefined>(props.value);
  const [optionalTags, setOptionalTags] = useState<TagEntry[]>([]);

  const init = () => {
    setInputKey(undefined);
    setOptionalTags([]);
  };

  const onFetchTags = (v?: string) => {
    setOptionalTags([]);

    fetcher
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/tags`, {
        params: {
          s: { $or: [{ name: { $cont: v } }] },
          limit: 30,
        } as CreateQueryParams,
      })
      .then((res: IHttpRes<ICrudListRes<TagEntry>>) => {
        if (res.data?.data?.data && !_.isEmpty(res.data.data.data) && !isAjaxCancelled.current) {
          return setOptionalTags(res.data?.data?.data as TagEntry[]);
        }

        return undefined;
      })
      .catch(httpErrorMsg);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearch = useCallback(
    _.debounce((v?: string) => onFetchTags(v), DEBOUNCE_MS),

    [],
  );

  const onSelect = (tagName: string) => {
    setInputKey('');
    const tagObject = optionalTags.find((item) => item.name === tagName);

    if (props.onSelectTagCallback && tagObject) props.onSelectTagCallback(tagObject);
  };

  const onClear = () => init();

  const onChange = (v: any) => {
    setInputKey(v);

    if (props.onChangeTagNameCallback) props.onChangeTagNameCallback(v);
    if (typeof v === 'undefined') onClear();
  };

  useEffect(() => {
    setInputKey('');
  }, [props.selectedTagsSize]);

  useEffect(() => {
    return () => init();
  }, []);

  return (
    <div className={cx(style['tag-search-box-comp-wrapper'], props.className)}>
      <div className={cx(style['container'])}>
        <AutoComplete
          // backfill
          ref={ref}
          autoFocus={props.autoFocus}
          allowClear
          defaultActiveFirstOption={false}
          style={{ width: '100%' }}
          onSearch={onSearch}
          onChange={onChange}
          onSelect={onSelect}
          options={optionalTags.map((tag) => ({
            label: tag.name,
            value: tag.name,
            // @ts-ignore
            need_create_one: tag?.need_create_one || 'n',
          }))}
          value={inputKey}
        />
      </div>
    </div>
  );
});
