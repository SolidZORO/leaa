import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { User } from '@leaa/common/entrys';
import { GET_USER, GET_ROLES } from '@leaa/common/graphqls';
import { RolesObject, RolesArgs } from '@leaa/common/dtos/role';
import { UserArgs, UpdateUserInput } from '@leaa/common/dtos/user';
import { IPage } from '@leaa/dashboard/interfaces';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';
import { UPDATE_USER } from '@leaa/common/graphqls/user.mutation';
import { UserInfoForm } from '../_components/UserInfoForm/UserInfoForm';
import { UserRoleForm } from '../_components/UserRoleForm/UserRoleForm';

import style from './style.less';

export default (props: IPage) => {
  const { id } = props.match.params as { id: string };

  let userInfoFormRef: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  let userRoleFormRef: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  const variables = { id: Number(id) };
  const { loading, data: userData, error: userError } = useQuery<{ user: User }, UserArgs>(GET_USER, { variables });

  if (userError) {
    return <ErrorCard message={userError.message} />;
  }

  const { data: rolesData, error: rolesError } = useQuery<{ roles: RolesObject }, RolesArgs>(GET_ROLES, {
    variables: {
      pageSize: 9999,
    },
  });

  if (rolesError) {
    return <ErrorCard message={rolesError.message} />;
  }

  const [submitVariables, setSubmitVariables] = useState<UpdateUserInput | undefined>();

  const [updateUser, { loading: submitLoading }] = useMutation<User>(UPDATE_USER, {
    variables: {
      id: Number(id),
      user: submitVariables,
    },
    onError(e) {
      message.error(e.message);
    },
    refetchQueries: ['GET_USER'],
    onCompleted(user) {
      message.success('Update Successful');
    },
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateUserInput = {
      roleIds: [],
    };

    // setUiSubmitLoading(true);

    userRoleFormRef.props.form.validateFieldsAndScroll(async (err: Error, formData: { roleIds: number[] }) => {
      if (err) {
        hasError = true;
        message.error(err.message);
      }

      submitData.roleIds = formData.roleIds;
    });

    if (hasError) {
      return;
    }

    userInfoFormRef.props.form.validateFieldsAndScroll(async (err: Error, formData: User) => {
      if (err) {
        hasError = true;
        message.error(err.message);
      }

      submitData = {
        ...submitData,
        ...formData,
      };
    });

    console.log(submitData.status);
    await setSubmitVariables(submitData);
    await updateUser();
  };

  return (
    <PageCard title={props.route.name} className={style['page-wapper']} loading={false}>
      <UserInfoForm
        item={userData && userData.user}
        loading={loading}
        wrappedComponentRef={(inst: unknown) => {
          userInfoFormRef = inst;
        }}
      />

      <UserRoleForm
        item={userData && userData.user}
        loading={loading}
        roles={(rolesData && rolesData.roles && rolesData.roles.items) || []}
        wrappedComponentRef={(inst: unknown) => {
          userRoleFormRef = inst;
        }}
      />

      <SubmitBar>
        <Button type="primary" size="large" loading={submitLoading} onClick={onSubmit}>
          Submit
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
