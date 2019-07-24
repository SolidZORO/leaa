import _ from 'lodash';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_USER_BY_TOKEN } from '@leaa/common/graphqls';
import { authUtil } from '@leaa/dashboard/utils';
import { IAuthInfo } from '@leaa/dashboard/interfaces';

interface IProps {
  children: React.ReactNode;
}

export const RefreshFlatePermissions = (props: IProps) => {
  if (authUtil.checkAuthIsAvailably()) {
    useQuery<{ userByToken: IAuthInfo }, { token: string }>(GET_USER_BY_TOKEN, {
      variables: { token: authUtil.getAuthToken() || '' },
      onCompleted: data => {
        if (data && data.userByToken && data.userByToken.flatePermissions) {
          authUtil.setAuthInfo(_.pick(data.userByToken, ['id', 'name', 'email', 'flatePermissions']));
        }
      },
    });
  }

  return <>{props.children}</>;
};
