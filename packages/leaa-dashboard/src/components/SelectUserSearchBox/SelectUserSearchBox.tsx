import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import _ from 'lodash';
import { Select, AutoComplete, Input } from 'antd';
import { User as UserEntry } from '@leaa/common/src/entrys';
import { UsersWithPaginationObject, UserArgs } from '@leaa/common/src/dtos/user';
import { GET_USERS } from '@leaa/common/src/graphqls';
import { apolloClient } from '@leaa/dashboard/src/libs';
import style from './style.module.less';

interface IProps {
  className?: string;
  useOnBlur?: boolean;
  enterCreateUser?: boolean;
  value?: string | undefined;
  autoFocus?: boolean;
  onSelectUserCallback?: (user: UserEntry) => void;
  onEnterCallback?: (user: string | undefined) => void;
  onChangeUserNameCallback?: (user: string | undefined) => void;
  placeholder?: string;
}

const DEBOUNCE_MS = 500;

export const SelectUserSearchBox = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

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
  };

  const onChange = (v: any) => {
    setInputKey(v);

    if (props.onChangeUserNameCallback) {
      props.onChangeUserNameCallback(v);
    }

    if (typeof v === 'undefined') {
      onClear();

      if (props.onEnterCallback) {
        props.onEnterCallback(undefined);
      }
    }
  };

  const onSearch = (v: string) => {
    onQueryUsers(v);
  };

  const onSelect = (user: any) => {
    console.log('onSelect', user);
    // const userObject = optionalUsers.find(item => item.name === user);

    if (props.onSelectUserCallback && user) {
      props.onSelectUserCallback(user);
    }
  };

  const onEnter = (e: any) => {
    console.log('onEnter', e);

    if (props.onEnterCallback) {
      props.onEnterCallback(e.currentTarget.value);
    }

    // TIPS:
    // It triggers both `onSelect` & `onEnter` when `onSelect` press Enter
    // So, don't use `onSelect` in here
  };

  // TIPS: onEnter & onSelect will be CONFLICT!
  return (
    <div className={style['wrapper']}>
      <div className={cx(style['container'], props.className)}>
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
            <Select.Option key={user.id}>{`#${user.id} ${user.name} (${user.email})`}</Select.Option>
          ))}
          placeholder={props.placeholder || t('_comp:SelectUserId.searchUsers')}
          value={inputKey}
        >
          <Input onPressEnter={onEnter} />
        </AutoComplete>
      </div>
    </div>
  );
});
