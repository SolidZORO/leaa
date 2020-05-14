import _ from 'lodash';
import React from 'react';
import { History } from 'history';
import { useQuery } from '@apollo/react-hooks';

// import { GET_USER_BY_TOKEN } from '@leaa/dashboard/src/graphqls';
import { LOGOUT_REDIRECT_URL } from '@leaa/dashboard/src/constants';
import { setAuthInfo, getAuthToken, removeAuth, checkAuthIsAvailably, ajax, errorMsg } from '@leaa/dashboard/src/utils';
import { IAuthInfo } from '@leaa/dashboard/src/interfaces';
import { envConfig } from '@leaa/dashboard/src/configs';

interface IProps {
  children: React.ReactNode;
  history: History;
}

export const RefreshflatPermissions = (props: IProps) => {
  if (checkAuthIsAvailably()) {
    ajax
      .post(`${envConfig.API_URL}/users/userByToken`, { token: getAuthToken() })
      .then((res) => {
        if (res.data?.flatPermissions && res.data.flatPermissions.length === 0) {
          removeAuth();
        }

        if (res.data?.flatPermissions) {
          setAuthInfo(_.pick(res.data, ['id', 'name', 'email', 'flatPermissions', 'avatar_url']));
        }
      })
      .catch((err) => {
        console.log('EEEERRRRRRRRRRRRRRRXXxxxxxxxxxxxx', err);
        if (removeAuth()) {
          return props.history.push(LOGOUT_REDIRECT_URL);
        }

        return false;

        //   onCompleted({ loginByTicket }) {
        //     clearGuestInfo();
        //     setLogin(loginByTicket);
        //   },
        //   onError: (e) => {
        //     errorMsg(e.message);
        //
        //     return props.history.push('/login');
        //   },
      });

    // useQuery<{ userByToken: IAuthInfo }, { token: string }>(GET_USER_BY_TOKEN, {
    //   variables: { token: getAuthToken() || '' },
    //   fetchPolicy: 'network-only',
    //   onError: () => {
    //     if (removeAuth()) {
    //       return props.history.push(LOGOUT_REDIRECT_URL);
    //     }
    //
    //     return false;
    //   },
    //   onCompleted: (data) => {
    //     if (data && data.userByToken.flatPermissions && data.userByToken.flatPermissions.length === 0) {
    //       removeAuth();
    //     }
    //
    //     if (data && data.userByToken && data.userByToken.flatPermissions) {
    //       setAuthInfo(_.pick(data.userByToken, ['id', 'name', 'email', 'flatPermissions', 'avatar_url']));
    //     }
    //   },
    // });
  }

  return <>{props.children}</>;
};
