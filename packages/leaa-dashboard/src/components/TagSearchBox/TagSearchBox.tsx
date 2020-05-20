import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import _ from 'lodash';
import { AutoComplete, Input } from 'antd';
import { AutoCompleteProps } from 'antd/es/auto-complete';
import { LoadingOutlined } from '@ant-design/icons';

import { Tag as TagEntry } from '@leaa/common/src/entrys';
import { ajax, errorMsg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes, IHttpError, ICrudListRes } from '@leaa/dashboard/src/interfaces';

import style from './style.module.less';

interface IProps extends AutoCompleteProps {
  className?: string;
  useOnBlur?: boolean;
  enterCreateTag?: boolean;
  value?: string;
  autoFocus?: boolean;
  onSelectTagCallback?: (tag: TagEntry) => void;
  onEnterCallback?: (tag?: string) => void;
  onChangeTagNameCallback?: (tag?: string) => void;
  placeholder?: string;
}

const DEBOUNCE_MS = 300;

export const TagSearchBox = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  const [inputKey, setInputKey] = useState<string | undefined>(props.value);
  const [optionalTags, setOptionalTags] = useState<TagEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const init = () => {
    setLoading(false);
    setInputKey(undefined);
    setOptionalTags([]);
  };

  const queryTags = useRef(
    _.debounce((v: string) => {
      setLoading(true);
      setOptionalTags([]);

      console.log(v);

      ajax
        .get(`${envConfig.API_URL}/tags`, {
          params: {
            s: {
              $or: [{ name: { $cont: v } }],
            },
          },
        })
        .then((res: IHttpRes<ICrudListRes<TagEntry>>) => {
          setOptionalTags(res.data?.data?.data as TagEntry[]);
        })
        .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS),
  );

  // query tags
  const onQueryTags = (tag: string) => queryTags.current(tag);

  const onClear = () => {
    init();
  };

  const onChange = (v: any) => {
    setInputKey(v);

    if (props.onChangeTagNameCallback) {
      props.onChangeTagNameCallback(v);
    }

    if (typeof v === 'undefined') {
      onClear();

      if (props.onEnterCallback) {
        props.onEnterCallback(undefined);
      }
    }
  };

  const onSearch = (v: string) => {
    onQueryTags(v);
  };

  const onSelect = (tagName: any) => {
    const tagObject = optionalTags.find((item) => item.name === tagName);

    if (props.onSelectTagCallback && tagObject) {
      props.onSelectTagCallback(tagObject);
    }
  };

  // TIPS:
  // It triggers both `onSelect` & `onEnter` when `onSelect` press Enter
  // So, don't use `onSelect` in here
  const onEnter = (e: any) => {
    if (props.onEnterCallback) {
      props.onEnterCallback(e.currentTarget.value);
    }
  };

  useEffect(() => {
    return () => init();
  }, []);

  // TIPS: onEnter & onSelect will be CONFLICT!
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
          }))}
          value={inputKey}
        >
          <Input
            onPressEnter={onEnter}
            suffix={loading ? <LoadingOutlined /> : <span />}
            placeholder={props.placeholder || t('_comp:SelectTagId.searchTags')}
          />
        </AutoComplete>
      </div>
    </div>
  );
});
