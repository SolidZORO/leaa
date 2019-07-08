import React from 'react';
import cx from 'classnames';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { Col, Form, Checkbox, Row, Descriptions, Card } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { User, Role } from '@leaa/common/entrys';
import { ITfn } from '@leaa/dashboard/interfaces';

import style from './style.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: User;
  roles: Role[];
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

@observer
class UserRoleFormInner extends React.PureComponent<IProps> {
  @observable checkAll: boolean = false;
  @observable indeterminate: boolean = false;

  constructor(props: IProps) {
    super(props);
  }

  componentDidUpdate(prevProps: Readonly<IProps>): void {
    if (this.props.form.getFieldValue('roleIds') && typeof this.props.roles.length !== 'undefined') {
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

  calcCheckStatus = (nextValue: number[]) => {
    if (nextValue.length === this.props.roles.length) {
      this.setCheckAll(true);
      this.setIndeterminate(false);
      return;
    }

    if (nextValue.length > 0) {
      this.setCheckAll(false);
      this.setIndeterminate(true);
      return;
    }

    if (nextValue.length === 0) {
      this.setCheckAll(false);
      this.setIndeterminate(false);
    }
  };

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <Form className={style['form-wrapper']}>
          <Card>
            <Descriptions title={t('_page:User.Component.userRoles')} />
            {props.roles && (
              <Row gutter={16} className={style['form-row']}>
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
                  initialValue: this.props.item && this.props.item.roles && this.props.item.roles.map(r => r.id),
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
          </Card>
        </Form>
      </div>
    );
  }
}

// @ts-ignore
export const UserRoleForm = withTranslation()(Form.create<IFormProps>()(UserRoleFormInner));
