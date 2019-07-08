import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  let userInfoFormRef: any;
  let userRoleFormRef: any;

  const getUserVariables = { id: Number(id) };
  const { loading, data: userData, error: userError } = useQuery<{ user: User }, UserArgs>(GET_USER, {
    variables: getUserVariables,
  });

  if (userError) {
    return <ErrorCard message={userError.message} />;
  }

  const getRolesVariables = { pageSize: 9999 };
  const { data: rolesData, error: rolesError } = useQuery<{ roles: RolesObject }, RolesArgs>(GET_ROLES, {
    variables: getRolesVariables,
  });

  if (rolesError) {
    return <ErrorCard message={rolesError.message} />;
  }

  const [submitVariables, setSubmitVariables] = useState<{ id: number; user: UpdateUserInput }>({
    id: Number(id),
    user: {},
  });

  const [updateUserMutate, { loading: submitLoading }] = useMutation<User>(UPDATE_USER, {
    variables: submitVariables,
    onError(e) {
      message.error(e.message);
    },
    onCompleted() {
      message.success(t('_lang:updatedSuccessfully'));
    },
    refetchQueries: () => [{ query: GET_USER, variables: getUserVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateUserInput = { roleIds: [] };

    userRoleFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: { roleIds: number[] }) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);
      }

      submitData.roleIds = formData.roleIds;
    });

    if (hasError) {
      return;
    }

    userInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: User) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);
      }

      submitData = {
        ...submitData,
        ...formData,
      };
    });

    if (hasError) {
      return;
    }

    await setSubmitVariables({
      ...submitVariables,
      ...{ user: submitData },
    });
    await updateUserMutate();
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['page-wapper']} loading={false}>
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
        <Button
          type="primary"
          size="large"
          icon="save"
          className="submit-button"
          loading={submitLoading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
