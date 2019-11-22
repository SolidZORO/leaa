import React from 'react';
import cx from 'classnames';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { Col, Form, Checkbox, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { User, Role } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { FormCard } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: User;
  roles: Role[];
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

@observer
class UserRolesFormInner extends React.PureComponent<IProps> {
  @observable checkAll = false;
  @observable indeterminate = false;

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount(): void {
    this.calcCheckStatus(this.props.form.getFieldValue('roleIds'));
  }

  componentDidUpdate(prevProps: Readonly<IProps>): void {
    if (this.props.form.getFieldValue('roleIds')) {
      this.calcCheckStatus(this.props.form.getFieldValue('roleIds'));
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
    this.props.form.setFieldsValue({ roleIds: event.target.checked ? this.props.roles.map(r => r.id) : [] });
  };

  onChange = (value: CheckboxValueType[]) => {
    const nextValue = value.map(v => Number(v));
    this.props.form.setFieldsValue({ roleIds: nextValue });
    this.calcCheckStatus(nextValue);
  };

  getUserRoleIds = (userItem: User | undefined): number[] => {
    const userRoles = userItem && userItem.roles;
    return (userRoles && userRoles.map(r => r.id)) || [];
  };

  calcCheckStatus = (selected: number[]) => {
    if (typeof selected === 'undefined' || typeof this.props.roles === 'undefined') {
      return;
    }

    if (selected.length > 0 && this.props.roles.length > 0 && selected.length === this.props.roles.length) {
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

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard title={t('_page:User.Component.userRoles')}>
          <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}>
            {props.roles && (
              <Row gutter={0} className={style['form-row']}>
                <Checkbox
                  indeterminate={this.indeterminate}
                  checked={this.checkAll}
                  onChange={this.onCheckAllChange}
                  className={style['check-all']}
                >
                  {t('_lang:checkAll')}
                </Checkbox>

                {getFieldDecorator('roleIds', {
                  validateTrigger: ['onBlur'],
                  initialValue: this.getUserRoleIds(this.props.item),
                })(
                  <Checkbox.Group onChange={this.onChange}>
                    <Row gutter={16} type="flex">
                      {props.roles.map(r => (
                        <Col key={r.id}>
                          <Checkbox value={r.id}>{r.name}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>,
                )}
              </Row>
            )}
          </Form>
        </FormCard>
      </div>
    );
  }
}

// @ts-ignore
export const UserRolesForm = withTranslation()(Form.create<IFormProps>()(UserRolesFormInner));
