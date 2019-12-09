import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import _ from 'lodash';
import { Select, AutoComplete, Input } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';

import { User as UserEntry, User } from '@leaa/common/src/entrys';
import { UsersWithPaginationObject, UserArgs, UsersArgs } from '@leaa/common/src/dtos/user';
import { GET_USERS, GET_USER } from '@leaa/common/src/graphqls';
import { apolloClient } from '@leaa/dashboard/src/libs';

import { Rcon } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps extends AutoCompleteProps {
  className?: string;
  useOnBlur?: boolean;
  enterCreateUser?: boolean;
  value?: string;
  defaultValue?: string | string[] | number;
  autoFocus?: boolean;
  onSelectUserCallback?: (user: UserEntry | undefined) => void;
  onEnterCallback?: (userId: number | undefined) => void;
  onChangeUserNameCallback?: (user: string | undefined) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

const DEBOUNCE_MS = 500;

export const UserSearchBox = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t, i18n } = useTranslation();

  const [inputKey, setInputKey] = useState<string | undefined>(props.value);
  const [optionalUsers, setOptionalUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onSelect = (userId: any) => {
    const userObject = optionalUsers.find(item => item.id === Number(userId));

    if (props.onSelectUserCallback && userObject) {
      props.onSelectUserCallback(userObject);
    }
  };

  // query users
  const queryUsers = useRef(
    _.debounce((q: string) => {
      setLoading(true);
      setOptionalUsers([]);

      apolloClient
        .query<{ users: UsersWithPaginationObject }, UsersArgs>({
          query: GET_USERS,
          variables: { page: 1, pageSize: 10, q },
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
  const onQueryUsers = (q: string) => queryUsers.current(q);

  // query user
  const onQueryUser = (userId: number) =>
    apolloClient
      .query<{ user: User }, UserArgs>({
        query: GET_USER,
        variables: { id: userId },
        fetchPolicy: 'network-only',
      })
      .then((result?: { data?: { user?: User } }) => {
        if (result && result.data && result.data.user) {
          setOptionalUsers([result.data.user]);

          setInputKey(`${userId}`);
        }
      })
      .finally(() => setLoading(false));

  const init = () => {
    setLoading(false);
    setInputKey(undefined);
    setOptionalUsers([]);
  };

  useEffect(() => {
    init();

    if (props.defaultValue) {
      onQueryUser(Number(props.defaultValue)).then();
    }
  }, []);

  const onClear = () => {
    if (props.onEnterCallback) {
      props.onEnterCallback(undefined);
    }

    if (props.onChangeUserNameCallback) {
      props.onChangeUserNameCallback(undefined);
    }

    if (props.onSelectUserCallback) {
      props.onSelectUserCallback(undefined);
    }

    init();
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
          defaultValue={props.defaultValue}
          size={props.size}
        >
          <Input
            onPressEnter={onEnter}
            className={style['search-input']}
            suffix={loading ? <Rcon type="loading" /> : <span />}
          />
        </AutoComplete>
      </div>
    </div>
  );
});
