import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_USERS } from '@leaa/common/graphqls';
import { DELETE_USER } from '@leaa/common/graphqls/user.mutation';
import { User } from '@leaa/common/entrys';
import { UsersObject, UsersArgs } from '@leaa/common/dtos/user';
import { IPage } from '@leaa/dashboard/interfaces';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';

export default (props: IPage) => {
  const getUsersQuery = useQuery<{ users: UsersObject }, UsersArgs>(GET_USERS);

  // if (getUsersQuery.error) {
  //   return <ErrorCard message={getUsersQuery.error.message} />;
  // }

  // useEffect(() => {
  //   (async () => getUsersQuery.refetch())();
  // }, [props.history.location.key]);

  // const [deleteUserMutate, { loading: deleteItemLoading }] = useMutation<User>(DELETE_USER, {
  //   onError(e) {
  //     console.log(e);
  //   },
  //   onCompleted(e) {
  //     console.log(e);
  //   },
  // });

  return <PageCard loading={false}>TEST</PageCard>;
};
