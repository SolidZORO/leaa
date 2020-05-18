import _ from 'lodash';
import React from 'react';
import { History } from 'history';
import { LOGOUT_REDIRECT_URL } from '@leaa/dashboard/src/constants';
import { setAuthInfo, getAuthToken, removeAuth, checkAuthIsAvailably, ajax } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes } from '@leaa/dashboard/src/interfaces';
import { User } from '@leaa/common/src/entrys';

interface IProps {
  children: React.ReactNode;
  history: History;
}

export const RefreshflatPermissions = (props: IProps) => {
  if (checkAuthIsAvailably()) {
    ajax
      .post(`${envConfig.API_URL}/users/userByToken`, { token: getAuthToken() })
      .then((res: IHttpRes<User>) => {
        if (
          !res ||
          !res.data ||
          !res.data.data ||
          !res.data.data.flatPermissions ||
          (res.data?.data.flatPermissions && res.data?.data.flatPermissions.length === 0)
        ) {
          removeAuth();
        }

        if (res.data?.data.flatPermissions) {
          setAuthInfo(_.pick(res.data.data, ['id', 'name', 'email', 'flatPermissions', 'avatar_url']));
        }
      })
      .catch(() => {
        if (removeAuth()) {
          return props.history.push(LOGOUT_REDIRECT_URL);
        }

        return false;
      });
  }

  return <>{props.children}</>;
};
