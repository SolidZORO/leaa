import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import _ from 'lodash';
import { AutoComplete, Input } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';
import { LoadingOutlined } from '@ant-design/icons';

import { User as UserEntry, User } from '@leaa/common/src/entrys';
import { UsersWithPaginationObject, UserArgs, UsersArgs } from '@leaa/common/src/dtos/user';
import { GET_USERS, GET_USER } from '@leaa/dashboard/src/graphqls';
import { apolloClient } from '@leaa/dashboard/src/libs';

import style from './style.module.less';

interface IProps extends AutoCompleteProps {
  className?: string;
  useOnBlur?: boolean;
  enterCreateUser?: boolean;
  value?: string;
  autoFocus?: boolean;
  onSelectUserCallback?: (user: UserEntry | undefined) => void;
  onEnterCallback?: (userId: string | undefined) => void;
  onChangeUserNameCallback?: (user: string | undefined) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

const DEBOUNCE_MS = 500;

export const UserSearchBox = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t, i18n } = useTranslation();

  const [inputKey, setInputKey] = useState<string | undefined>(props.value ? `${props.value}` : undefined);
  const [optionalUsers, setOptionalUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const makeUserLabel = (user?: User) => (!user ? undefined : `#${user?.id} - ${user?.name} - ${user?.email}`);

  const queryUsers = useRef(
    _.debounce((q: string) => {
      setLoading(true);
      setOptionalUsers([]);

      apolloClient
        .query<{ users: UsersWithPaginationObject }, UsersArgs>({
          query: GET_USERS,
          variables: { page: 1, pageSize: 10, q },
          // fetchPolicy: 'network-only',
        })
        .then((result: { data: { users: UsersWithPaginationObject } }) => {
          if (result && result.data.users && result.data.users.items) {
            setOptionalUsers(result.data.users.items);
          }
        })
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS),
  );

  // query users
  const onQueryUsers = (q: string) => queryUsers.current(q);

  // query user
  const onQueryUser = (userId: string) =>
    apolloClient
      .query<{ user: User }, UserArgs>({
        query: GET_USER,
        variables: { id: userId },
        // fetchPolicy: 'network-only',
      })
      .then((result?: { data?: { user?: User } }) => {
        if (result && result.data && result.data.user) {
          setOptionalUsers([result.data.user]);

          // TODO Antd v4 need to set the label manually, v3 is auto.
          // setInputKey(`${userId}`);
          setInputKey(makeUserLabel(result.data.user));
        }
      })
      .finally(() => setLoading(false));

  const init = () => {
    setLoading(false);
    setInputKey(undefined);
    setOptionalUsers([]);
  };

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

  useEffect(() => {
    init();

    if (props.value) onQueryUser(props.value).then();
  }, []);

  useEffect(() => {
    if (!props.value) onClear();
  }, [props.value]);

  const onSelect = (userId: string) => {
    const userObject = optionalUsers.find((item) => item.id === userId);

    setInputKey(makeUserLabel(userObject));

    if (props.onSelectUserCallback && userObject) {
      props.onSelectUserCallback(userObject);
    }
  };

  const onChange = (str: any) => {
    setInputKey(str);

    if (props.onChangeUserNameCallback) {
      props.onChangeUserNameCallback(str);
    }

    if (str === undefined || '') {
      onClear();
    }
  };

  const onSearch = (str: string) => {
    onQueryUsers(str);
  };

  const onEnter = (e: any) => {
    if (props.onEnterCallback) {
      props.onEnterCallback(e.currentTarget.value);
    }
  };

  const options = optionalUsers.map((user) => ({
    label: makeUserLabel(user),
    value: `${user.id}`,
  }));

  // TIPS: onEnter & onSelect will be CONFLICT!
  return (
    <div className={cx(style['wrapper'], props.className)} style={props.style}>
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
          options={options}
          value={inputKey || undefined}
        >
          <Input
            onPressEnter={onEnter}
            className={style['search-input']}
            suffix={loading ? <LoadingOutlined /> : <span />}
            placeholder={props.placeholder || t('_comp:UserSearchBox.searchUsers', i18n.language)}
          />
        </AutoComplete>
      </div>
    </div>
  );
});
