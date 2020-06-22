import _ from 'lodash';
import React from 'react';
import { history } from '@leaa/dashboard/src/libs';
import { LOGOUT_REDIRECT_URL } from '@leaa/dashboard/src/constants';
import { setAuthInfo, getAuthToken, removeAuth, checkAuthIsAvailably, ajax, errorMsg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes } from '@leaa/dashboard/src/interfaces';
import { User } from '@leaa/api/src/entrys';

interface IProps {
  children: React.ReactNode;
}

export const RefreshflatPermissions = (props: IProps) => {
  if (checkAuthIsAvailably()) {
    ajax
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/auth/user-by-token`, { token: getAuthToken() })
      .then((res: IHttpRes<User>) => {
        if (res.data?.data?.flatPermissions && res.data?.data.flatPermissions.length === 0) removeAuth();

        if (res.data?.data?.flatPermissions && res.data?.data.flatPermissions.length !== 0) {
          setAuthInfo(_.pick(res.data.data, ['id', 'name', 'email', 'flatPermissions', 'avatar_url']));
        }
      })
      .catch((e) => {
        if (e?.message === 'Network Error') return errorMsg(e.message);
        if (e?.message) errorMsg(e.message);

        if (removeAuth()) return history.push(LOGOUT_REDIRECT_URL);

        return false;
      });
  }

  return <>{props.children}</>;
};
