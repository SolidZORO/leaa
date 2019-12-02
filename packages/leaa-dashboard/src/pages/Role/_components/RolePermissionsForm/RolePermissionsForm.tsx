import React from 'react';
import cx from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { Role, Permission } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { FormCard } from '@leaa/dashboard/src/components';

import { RolePermissionsCheckbox } from '../RolePermissionsCheckbox/RolePermissionsCheckbox';

import style from './style.module.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Role;
  permissions: Permission[];
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

@observer
class RolePermissionsFormInner extends React.PureComponent<IProps> {
  @observable checkAll = false;
  @observable indeterminate = false;

  constructor(props: IProps) {
    super(props);
  }

  componentDidUpdate(prevProps: Readonly<IProps>): void {
    if (prevProps.item && this.props.item && prevProps.item.permissions !== this.props.item.permissions) {
      this.props.form.setFieldsValue({ permissionIds: this.getPermissionIds(this.props.item) });
    }
  }

  getPermissionIds = (roleItem: Role | undefined): number[] => {
    const rolePermissions = roleItem && roleItem.permissions;

    return (rolePermissions && rolePermissions.map(r => r.id)) || [];
  };

  render() {
    const { props } = this;

    if (!props.item) return null;
    if (!props.permissions) return null;

    const { t } = props;
    const { getFieldDecorator } = props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard title={t('_page:Role.Component.rolePermissions')}>
          <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}>
            <div className={style['form-row']}>
              {getFieldDecorator('permissionIds', {
                validateTrigger: ['onBlur'],
                initialValue: this.getPermissionIds(props.item),
              })(
                <RolePermissionsCheckbox
                  permissionsFlat={(props.permissions && props.permissions.length > 0 && props.permissions) || []}
                  onChangePermissionIds={permissionIds => props.form.setFieldsValue({ permissionIds })}
                />,
              )}
            </div>
          </Form>
        </FormCard>
      </div>
    );
  }
}

// @ts-ignore
export const RolePermissionsForm = withTranslation()(Form.create<IFormProps>()(RolePermissionsFormInner));
