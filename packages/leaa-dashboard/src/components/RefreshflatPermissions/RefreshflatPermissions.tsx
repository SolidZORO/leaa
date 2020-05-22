import _ from 'lodash';
import React from 'react';
import { History } from 'history';
import { LOGOUT_REDIRECT_URL } from '@leaa/dashboard/src/constants';
import { setAuthInfo, getAuthToken, removeAuth, checkAuthIsAvailably, ajax, errorMsg } from '@leaa/dashboard/src/utils';
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
        if (res.data?.data?.flatPermissions && res.data?.data.flatPermissions.length === 0) {
          removeAuth();

          console.log(2111111);
        }

        if (res.data?.data?.flatPermissions && res.data?.data.flatPermissions.length !== 0) {
          setAuthInfo(_.pick(res.data.data, ['id', 'name', 'email', 'flatPermissions', 'avatar_url']));
        }
      })
      .catch((e) => {
        if (e?.message === 'Network Error') return errorMsg(e.message);
        if (e?.message) errorMsg(e.message);
        if (removeAuth()) return props.history.push(LOGOUT_REDIRECT_URL);

        return false;
      });
  }

  return <>{props.children}</>;
};
