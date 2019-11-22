import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { User } from '@leaa/common/src/entrys';
import { GET_USER, GET_ROLES, UPDATE_USER } from '@leaa/common/src/graphqls';
import { RolesWithPaginationObject, RolesArgs } from '@leaa/common/src/dtos/role';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { UserArgs, UpdateUserInput } from '@leaa/common/src/dtos/user';
import { IPage } from '@leaa/dashboard/src/interfaces';

import { HtmlMeta, PageCard, ErrorCard, SubmitBar } from '@leaa/dashboard/src/components';

import { UserInfoForm } from '../_components/UserInfoForm/UserInfoForm';
import { UserRolesForm } from '../_components/UserRolesForm/UserRolesForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const [userInfoFormRef, setUserInfoFormRef] = useState<any>();
  const [userRoleFormRef, setUserRoleFormRef] = useState<any>();

  // query
  const getUserVariables = { id: Number(id) };
  const getUserQuery = useQuery<{ user: User }, UserArgs>(GET_USER, {
    variables: getUserVariables,
    fetchPolicy: 'network-only',
  });

  const getRolesVariables = { pageSize: 9999 };
  const getRolesQuery = useQuery<{ roles: RolesWithPaginationObject }, RolesArgs>(GET_ROLES, {
    variables: getRolesVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: number; user: UpdateUserInput }>({
    id: Number(id),
    user: {},
  });
  const [updateUserMutate, updateUserMutation] = useMutation<User>(UPDATE_USER, {
    variables: submitVariables,
    onCompleted: () => message.success(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_USER, variables: getUserVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateUserInput = { roleIds: [] };

    userRoleFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: { roleIds: number[] }) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
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

        return;
      }

      submitData = {
        ...submitData,
        ...formData,
      };
    });

    if (hasError) {
      return;
    }

    const nextSubmitData = {
      ...submitVariables,
      ...{ user: submitData },
    };

    await setSubmitVariables(nextSubmitData);
    await updateUserMutate();

    // keep form fields consistent with API
    userInfoFormRef.props.form.resetFields();
    userRoleFormRef.props.form.resetFields();
  };

  return (
    <PageCard
      title={t(`${props.route.namei18n}`)}
      className={style['wapper']}
      loading={getUserQuery.loading || updateUserMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getUserQuery.error ? <ErrorCard error={getUserQuery.error} /> : null}
      {getRolesQuery.error ? <ErrorCard error={getRolesQuery.error} /> : null}
      {updateUserMutation.error ? <ErrorCard error={updateUserMutation.error} /> : null}

      <UserInfoForm
        item={getUserQuery.data && getUserQuery.data.user}
        loading={getUserQuery.loading}
        wrappedComponentRef={(inst: unknown) => setUserInfoFormRef(inst)}
      />

      <UserRolesForm
        item={getUserQuery.data && getUserQuery.data.user}
        loading={getUserQuery.loading}
        roles={(getRolesQuery.data && getRolesQuery.data.roles && getRolesQuery.data.roles.items) || []}
        wrappedComponentRef={(inst: unknown) => setUserRoleFormRef(inst)}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          loading={updateUserMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
