import _ from 'lodash';
import cx from 'classnames';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

import { useTranslation } from 'react-i18next';

import { Role, Permission } from '@leaa/api/src/entrys';
import { errorMsg } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { RoleUpdateOneReq } from '@leaa/api/src/dtos/role';

import { FormCard } from '@leaa/dashboard/src/components';
import { RolePermissionsCheckbox } from '../RolePermissionsCheckbox/RolePermissionsCheckbox';
import { RolePermissionLength } from '../RolePermissionLength/RolePermissionLength';

import style from './style.module.less';

interface IProps {
  permissions: Permission[];
  item?: Role;
  className?: string;
  loading?: boolean;
}

export const RolePermissionsForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [permissionLength, setPermissionLength] = useState(0);

  const getPermissionIds = (roleItem: Role | undefined): string[] => {
    const rolePermissions = roleItem && roleItem.permissions;

    return (rolePermissions && rolePermissions.map((r) => r.id)) || [];
  };

  const onValidateForm = async (): IOnValidateFormResult<RoleUpdateOneReq> => {
    try {
      return await form.validateFields();
    } catch (err) {
      return errorMsg(err.errorFields[0]?.errors[0]);
    }
  };

  const onRefreshForm = (item?: Role) => {
    if (!item) return form.setFieldsValue({});

    form.resetFields();

    const permissionIds = getPermissionIds(props.item);

    form.setFieldsValue({
      ...item,
      permissionIds,
    });

    setPermissionLength(permissionIds.length);

    return undefined;
  };

  const onChangePermissionIds = (permissionIds: CheckboxValueType[] | undefined) => {
    form.setFieldsValue({ permissionIds });

    if (permissionIds) setPermissionLength(permissionIds.length);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onRefreshForm(props.item), [form, props.item]);
  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={
          <span>
            {t('_page:Role.rolePermissions')}{' '}
            <sup>
              <RolePermissionLength
                rolePermissionsLength={permissionLength}
                allPermissionsLength={props.permissions.length}
              />
            </sup>
          </span>
        }
      >
        <Form form={form} name="role-permissions" layout="vertical">
          <Form.Item name="permissionIds" rules={[]} validateTrigger={['onBlur']}>
            <RolePermissionsCheckbox
              permissionsFlat={
                (_.isArray(props.permissions) &&
                  !_.isEmpty(props.permissions) &&
                  _.isArray(props.permissions) &&
                  props.permissions) ||
                []
              }
              onChangePermissionIds={onChangePermissionIds}
            />
          </Form.Item>
        </Form>
      </FormCard>
    </div>
  );
});
