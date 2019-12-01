import _ from 'lodash';
import React from 'react';
import { History } from 'history';
import { useQuery } from '@apollo/react-hooks';

import { GET_USER_BY_TOKEN } from '@leaa/common/src/graphqls';
import { LOGOUT_REDIRECT_URL } from '@leaa/dashboard/src/constants';
import { authUtil, messageUtil } from '@leaa/dashboard/src/utils';
import { IAuthInfo } from '@leaa/dashboard/src/interfaces';

interface IProps {
  children: React.ReactNode;
  history: History;
}

export const RefreshFlatePermissions = (props: IProps) => {
  if (authUtil.checkAuthIsAvailably()) {
    useQuery<{ userByToken: IAuthInfo }, { token: string }>(GET_USER_BY_TOKEN, {
      variables: { token: authUtil.getAuthToken() || '' },
      fetchPolicy: 'network-only',
      onCompleted: data => {
        if (data && data.userByToken.flatePermissions && data.userByToken.flatePermissions.length === 0) {
          authUtil.removeAuth();
        }

        if (data && data.userByToken && data.userByToken.flatePermissions) {
          authUtil.setAuthInfo(_.pick(data.userByToken, ['id', 'name', 'email', 'flatePermissions']));
        }
      },
      onError: e => {
        if (authUtil.removeAuth()) {
          return props.history.push(LOGOUT_REDIRECT_URL);
        }

        return messageUtil.gqlError(e.message);
      },
    });
  }

  return <>{props.children}</>;
};
