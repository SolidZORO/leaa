import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Role } from '@leaa/common/src/entrys';
import { GET_PERMISSIONS, GET_ROLE, UPDATE_ROLE } from '@leaa/dashboard/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { RoleArgs, UpdateRoleInput } from '@leaa/common/src/dtos/role';
import { PermissionsWithPaginationObject, PermissionsArgs } from '@leaa/common/src/dtos/permission';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { msgUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { RoleInfoForm } from '../_components/RoleInfoForm/RoleInfoForm';
import { RolePermissionsForm } from '../_components/RolePermissionsForm/RolePermissionsForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const infoFormRef = useRef<ICommenFormRef<UpdateRoleInput>>(null);
  const permissionsRef = useRef<ICommenFormRef<UpdateRoleInput>>(null);

  // query
  const getRoleVariables = { id: Number(id) };
  const getRoleQuery = useQuery<{ role: Role }, RoleArgs>(GET_ROLE, {
    variables: getRoleVariables,
    fetchPolicy: 'network-only',
  });

  const getPermissionsVariables = { pageSize: 9999 };
  const getPermissionsQuery = useQuery<{ permissions: PermissionsWithPaginationObject }, PermissionsArgs>(
    GET_PERMISSIONS,
    {
      variables: getPermissionsVariables,
      fetchPolicy: 'network-only',
    },
  );

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: number; role: UpdateRoleInput }>({
    id: Number(id),
    role: {},
  });

  const [updateRoleMutate, updateRoleMutation] = useMutation<Role>(UPDATE_ROLE, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msgUtil.message(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_ROLE, variables: getRoleVariables }],
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<UpdateRoleInput> = await infoFormRef.current?.onValidateForm();
    const permissionsData: ISubmitData<UpdateRoleInput> = await permissionsRef.current?.onValidateForm();

    if (!infoData) return;
    if (!permissionsData || (permissionsData && !Array.isArray(permissionsData.permissionIds))) return;

    const submitData: ISubmitData<UpdateRoleInput> = {
      ...infoData,
      ...permissionsData,
    };

    await setSubmitVariables({ id: Number(id), role: submitData });
    await updateRoleMutate();
  };

  return (
    <PageCard
      title={
        <span>
          <Rcon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
        </span>
      }
      className={style['wapper']}
      loading={getRoleQuery.loading || updateRoleMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <RoleInfoForm ref={infoFormRef} item={getRoleQuery.data?.role} loading={getRoleQuery.loading} />

      <RolePermissionsForm
        ref={permissionsRef}
        item={getRoleQuery.data?.role}
        loading={getRoleQuery.loading}
        permissions={getPermissionsQuery.data?.permissions?.items || []}
      />

      <SubmitBar full>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={updateRoleMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
