import React, { useState, useEffect, forwardRef, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import _ from 'lodash';
import { AutoComplete } from 'antd';
import { AutoCompleteProps } from 'antd/es/auto-complete';
import { CreateQueryParams } from '@nestjsx/crud-request';

import { Tag as TagEntry } from '@leaa/common/src/entrys';
import { ajax, errorMsg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes, IHttpError, ICrudListRes } from '@leaa/dashboard/src/interfaces';

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
  const { t } = useTranslation();

  const isAjaxCancelled = useRef(false);

  const [inputKey, setInputKey] = useState<string | undefined>(props.value);
  const [optionalTags, setOptionalTags] = useState<TagEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const init = () => {
    setLoading(false);
    setInputKey(undefined);
    setOptionalTags([]);
  };

  const onFetchTags = (v?: string) => {
    setLoading(true);
    setOptionalTags([]);

    ajax
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
      .catch((err: IHttpError) => {
        // console.log(err.response?.data?.message || err.message);
        errorMsg(err.response?.data?.message || err.message);
      })
      .finally(() => !isAjaxCancelled.current && setLoading(false));
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
    <div className={cx(style['wrapper'], props.className)}>
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
