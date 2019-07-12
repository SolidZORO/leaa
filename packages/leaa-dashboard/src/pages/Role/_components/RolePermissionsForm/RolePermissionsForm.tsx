import _ from 'lodash';
import React from 'react';
import cx from 'classnames';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { Col, Form, Checkbox, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { Role, Permission } from '@leaa/common/entrys';
import { ITfn } from '@leaa/dashboard/interfaces';
import { FormCard } from '@leaa/dashboard/components/FormCard';

import style from './style.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Role;
  permissions: Permission[];
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

@observer
class RolePermissionsFormInner extends React.PureComponent<IProps> {
  @observable checkAll: boolean = false;
  @observable indeterminate: boolean = false;

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount(): void {
    this.calcCheckStatus(this.props.form.getFieldValue('permissionIds'));
  }

  componentDidUpdate(prevProps: Readonly<IProps>): void {
    if (this.props.form.getFieldValue('permissionIds')) {
      this.calcCheckStatus(this.props.form.getFieldValue('permissionIds'));
    }
  }

  @action.bound
  setCheckAll = (value: boolean) => {
    this.checkAll = value;
  };

  @action.bound
  setIndeterminate = (value: boolean) => {
    this.indeterminate = value;
  };

  onCheckAllChange = (event: CheckboxChangeEvent): void => {
    this.setIndeterminate(false);
    this.setCheckAll(event.target.checked);
    this.props.form.setFieldsValue({
      permissionIds: event.target.checked ? this.props.permissions.map(r => r.id) : [],
    });
  };

  onChange = (value: CheckboxValueType[]) => {
    const nextValue = value.map(v => Number(v));
    this.props.form.setFieldsValue({ permissionIds: nextValue });
    this.calcCheckStatus(nextValue);
  };

  getRolePermissionIds = (roleItem: Role | undefined): number[] => {
    const rolePermissions = roleItem && roleItem.permissions;
    return (rolePermissions && rolePermissions.map(r => r.id)) || [];
  };

  calcCheckStatus = (selected: number[]) => {
    if (typeof selected === 'undefined' || typeof this.props.permissions === 'undefined') {
      return;
    }

    if (selected.length > 0 && this.props.permissions.length > 0 && selected.length === this.props.permissions.length) {
      this.setCheckAll(true);
      this.setIndeterminate(false);
      return;
    }

    if (selected.length > 0) {
      this.setCheckAll(false);
      this.setIndeterminate(true);
      return;
    }

    this.setCheckAll(false);
    this.setIndeterminate(false);
  };

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;
    const permissionsFlat = (props.permissions && props.permissions.length > 0 && props.permissions) || [];
    const permissionsGroup = _.groupBy(permissionsFlat, 'slugGroup');

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard title={t('_page:Role.Component.rolePermissions')}>
          <Form className={style['form-wrapper']}>
            {permissionsGroup && (
              <div className={style['form-row']}>
                <Checkbox
                  indeterminate={this.indeterminate}
                  checked={this.checkAll}
                  onChange={this.onCheckAllChange}
                  className={style['check-all']}
                >
                  {t('_lang:checkAll')}
                </Checkbox>

                {getFieldDecorator('permissionIds', {
                  validateTrigger: ['onBlur'],
                  initialValue: this.getRolePermissionIds(this.props.item),
                })(
                  <Checkbox.Group onChange={this.onChange}>
                    {_.map(permissionsGroup, (pg, key) => (
                      <div key={key} className={style['permission-key-group']}>
                        <h3>{t(`_route:${key}`)}</h3>
                        <Row gutter={16} type="flex" className={style['permission-group']}>
                          {pg.map(p => (
                            <Col key={p.id} xs={12} lg={6}>
                              <Checkbox value={p.id}>{p.name}</Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    ))}
                  </Checkbox.Group>,
                )}
              </div>
            )}
          </Form>
        </FormCard>
      </div>
    );
  }
}

// @ts-ignore
export const RolePermissionsForm = withTranslation()(Form.create<IFormProps>()(RolePermissionsFormInner));
