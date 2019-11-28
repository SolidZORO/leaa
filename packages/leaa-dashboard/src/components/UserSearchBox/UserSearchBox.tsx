import React, { useState, useEffect, useRef, forwardRef, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import _ from 'lodash';
import { Select, AutoComplete, Input, Icon } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';

import { User as UserEntry } from '@leaa/common/src/entrys';
import { UsersWithPaginationObject, UserArgs } from '@leaa/common/src/dtos/user';
import { GET_USERS } from '@leaa/common/src/graphqls';
import { apolloClient } from '@leaa/dashboard/src/libs';

import style from './style.module.less';

interface IProps extends AutoCompleteProps {
  style?: CSSProperties;
  className?: string;
  useOnBlur?: boolean;
  enterCreateUser?: boolean;
  value?: string | undefined;
  autoFocus?: boolean;
  onSelectUserCallback?: (user: UserEntry | undefined) => void;
  onEnterCallback?: (userId: number | undefined) => void;
  onChangeUserNameCallback?: (user: string | undefined) => void;
  placeholder?: string;
}

const DEBOUNCE_MS = 500;

export const UserSearchBox = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t, i18n } = useTranslation();

  const [inputKey, setInputKey] = useState<string | undefined>(props.value);
  const [optionalUsers, setOptionalUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const init = () => {
    setLoading(false);
    setInputKey(undefined);
    setOptionalUsers([]);
  };

  useEffect(() => {
    return () => init();
  }, []);

  // query
  const queryUsers = useRef(
    _.debounce((v: string) => {
      setLoading(true);
      setOptionalUsers([]);

      apolloClient
        .query<{ users: UsersWithPaginationObject }, UserArgs>({
          query: GET_USERS,
          variables: { page: 1, pageSize: 10, q: v },
          fetchPolicy: 'network-only',
        })
        .then((result: { data: { users: UsersWithPaginationObject } }) => {
          if (result && result.data.users && result.data.users.items) {
            setOptionalUsers(result.data.users.items);
          }
        })
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS),
  );

  // query
  const onQueryUsers = (user: string) => queryUsers.current(user);

  const onClear = () => {
    init();

    if (props.onEnterCallback) {
      props.onEnterCallback(undefined);
    }

    if (props.onChangeUserNameCallback) {
      props.onChangeUserNameCallback(undefined);
    }
    if (props.onSelectUserCallback) {
      props.onSelectUserCallback(undefined);
    }
  };

  const onChange = (v: any) => {
    setInputKey(v);

    if (props.onChangeUserNameCallback) {
      props.onChangeUserNameCallback(v);
    }

    if (typeof v === 'undefined') {
      onClear();
    }
  };

  const onSearch = (v: string) => {
    onQueryUsers(v);
  };

  const onSelect = (userId: any) => {
    const userObject = optionalUsers.find(item => item.id === Number(userId));

    if (props.onSelectUserCallback && userObject) {
      props.onSelectUserCallback(userObject);
    }
  };

  const onEnter = (e: any) => {
    if (props.onEnterCallback) {
      props.onEnterCallback(e.currentTarget.value);
    }
  };

  // TIPS: onEnter & onSelect will be CONFLICT!
  return (
    <div className={style['wrapper']}>
      <div className={cx(style['container'], props.className)} style={props.style}>
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
          dataSource={optionalUsers.map(user => (
            <Select.Option key={user.id}>{`#${user.id} - ${user.name} - ${user.email}`}</Select.Option>
          ))}
          placeholder={props.placeholder || t('_comp:UserSearchBox.searchUsers', i18n.language)}
          value={inputKey}
          size={props.size}
        >
          <Input
            onPressEnter={onEnter}
            className={style['search-input']}
            suffix={loading ? <Icon type="loading" /> : <span />}
          />
        </AutoComplete>
      </div>
    </div>
  );
});
