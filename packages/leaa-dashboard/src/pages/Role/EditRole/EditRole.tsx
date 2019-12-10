import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Role } from '@leaa/common/src/entrys';
import { GET_PERMISSIONS, GET_ROLE, UPDATE_ROLE } from '@leaa/common/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { RoleArgs, UpdateRoleInput } from '@leaa/common/src/dtos/role';
import { PermissionsWithPaginationObject, PermissionsArgs } from '@leaa/common/src/dtos/permission';
import { IPage, IKey } from '@leaa/dashboard/src/interfaces';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { RoleInfoForm } from '../_components/RoleInfoForm/RoleInfoForm';
import { RolePermissionsForm } from '../_components/RolePermissionsForm/RolePermissionsForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const [roleInfoFormRef, setRoleInfoFormRef] = useState<any>();
  const [rolePermissionsFormRef, setRolePermissionsFormRef] = useState<any>();

  // query
  const getRoleVariables = { id: Number(id) };
  const getRoleQuery = useQuery<{ role: Role }, RoleArgs>(GET_ROLE, {
    variables: getRoleVariables,
    fetchPolicy: 'network-only',
  });

  const getPermissionsVariables = { pageSize: 9999 };
  const getPermissionsQuery = useQuery<{ permissions: PermissionsWithPaginationObject }, PermissionsArgs>(
    GET_PERMISSIONS,
    { variables: getPermissionsVariables, fetchPolicy: 'network-only' },
  );

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: number; role: UpdateRoleInput }>({
    id: Number(id),
    role: {},
  });

  const [updateRoleMutate, updateRoleMutation] = useMutation<Role>(UPDATE_ROLE, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlCompleted(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_ROLE, variables: getRoleVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateRoleInput = { permissionIds: [] };

    rolePermissionsFormRef.props.form.validateFieldsAndScroll((err: any, formData: { permissionIds: number[] }) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      submitData.permissionIds = formData.permissionIds;
    });

    if (hasError) {
      return;
    }

    roleInfoFormRef.props.form.validateFieldsAndScroll((err: any, formData: Role) => {
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
      ...{ role: submitData },
    };

    await setSubmitVariables(nextSubmitData);
    await updateRoleMutate();

    // keep form fields consistent with API
    roleInfoFormRef.props.form.resetFields();
    rolePermissionsFormRef.props.form.resetFields();
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

      <RoleInfoForm
        item={getRoleQuery.data && getRoleQuery.data.role}
        loading={getRoleQuery.loading}
        wrappedComponentRef={(inst: unknown) => setRoleInfoFormRef(inst)}
      />

      <RolePermissionsForm
        item={getRoleQuery.data && getRoleQuery.data.role}
        loading={getRoleQuery.loading}
        permissions={
          getPermissionsQuery.data && getPermissionsQuery.data.permissions && getPermissionsQuery.data.permissions.items
        }
        wrappedComponentRef={(inst: unknown) => setRolePermissionsFormRef(inst)}
      />

      <SubmitBar full>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          loading={updateRoleMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
